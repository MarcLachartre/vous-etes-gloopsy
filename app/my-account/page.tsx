import { Collection } from 'mongodb'
import { UserDetails } from '@/components/my-account/user-details'
import { Gloopstatistics } from '@/components/my-account/gloopstatistic'
import { Session } from 'next-auth'
import { getDatabase } from '@/lib/mongo-connection'
import { usernameValidation } from '@/lib/username-validation'
import { auth } from '@/auth'

export default async function () {
    const session = await auth()

    if (!session) return <h2>Not authenticated</h2>
    if (session.user?.role !== 'MEMBER') return <h2>Not authorized</h2>

    const getUserName = async (session: Session | null) => {
        'use server'
        const db = await getDatabase()

        const mongoUser = await db
            .collection('users')
            .findOne({ email: session?.user?.email })

        if (mongoUser.username !== undefined) {
            return mongoUser.username
        } else if (session?.user?.username !== null && session !== null) {
            return session.user.username
        } else if (session?.user?.name !== null) {
            return session?.user?.name
        } else {
            return ''
        }
    }

    const updateUsername = async (username?: string) => {
        'use server'
        const s = await auth()

        if (!s || s.user?.role !== 'MEMBER')
            return {
                ok: false,
                status: 403,
                statusText: 'Access Denied',
            }

        if (username !== undefined && !usernameValidation(username).isValid) {
            return { ok: false, status: 400 }
        }

        const session = await auth()

        const db = await getDatabase()

        const res = await db
            .collection('users')
            .updateOne(
                { email: session?.user?.email },
                { $set: { username: username } }
            )

        if ((await res.matchedCount) === 1) {
            return { ok: true, status: 200, statusText: 'OK' }
        } else {
            return {
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            }
        }
    }

    const getTwelveMonthsCount = async (collection: Collection, req?: any) => {
        'use server'
        const currentMonth = new Date().getMonth()

        const timestamps: number[] = []
        for (let i = 0; i <= 11; i++) {
            const t = new Date(
                new Date(
                    new Date(new Date().setDate(1)).setMonth(currentMonth - i)
                ).setHours(0)
            ).getTime()

            timestamps[11 - i] = t
        }
        timestamps.push(Date.now())

        const twelveMonthsCount = []

        for (let i = 0; i <= 11; i++) {
            const count = await collection.countDocuments(
                {
                    'properties.timestamp': {
                        $gt: timestamps[i],
                        $lt: timestamps[i + 1],
                    },
                    'properties.email': req,
                },
                { hint: '_id_' }
            )

            twelveMonthsCount.push(count)
        }

        return twelveMonthsCount
    }

    const getData = async (personal?: boolean, session?: Session | null) => {
        'use server'

        const dt = new Date()
        const monthTimestamp = new Date(
            dt.getFullYear(),
            dt.getMonth(),
            1
        ).getTime()

        const yearTimestamp = new Date(dt.getFullYear(), 0, 1).getTime()

        const db = await getDatabase()
        const collection = await db.collection('location')

        const req = personal ? session?.user.email : { $exists: true }

        const { allTimeCount, yearlyCount, monthlyCount, twelveMonthsCount } = {
            allTimeCount: await collection.countDocuments({
                'properties.email': personal
                    ? session?.user.email
                    : { $exists: true },
            }),
            yearlyCount: await collection.countDocuments(
                {
                    'properties.timestamp': { $gt: yearTimestamp },
                    'properties.email': personal
                        ? session?.user.email
                        : { $exists: true },
                },
                { hint: '_id_' }
            ),
            monthlyCount: await collection.countDocuments(
                {
                    'properties.timestamp': { $gt: monthTimestamp },

                    'properties.email': personal
                        ? session?.user.email
                        : { $exists: true },
                },
                { hint: '_id_' }
            ),

            twelveMonthsCount: await getTwelveMonthsCount(collection, req),
        }

        if (
            typeof allTimeCount !== 'number' ||
            typeof yearlyCount !== 'number' ||
            typeof allTimeCount !== 'number'
        ) {
            return {
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            }
        }

        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            body: {
                allTimeCount,
                yearlyCount,
                monthlyCount,
                twelveMonthsCount,
            },
        }
    }

    const username = await getUserName(session)

    const [globalData, personalData] = await Promise.all([
        getData(),
        getData(true, session),
    ])

    return (
        <div className="page-container">
            <UserDetails userName={username} updateUsername={updateUsername} />
            <Gloopstatistics
                globalData={globalData.body}
                personalData={personalData.body}
            />
        </div>
    )
}
