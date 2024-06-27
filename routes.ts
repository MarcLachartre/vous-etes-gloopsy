/**   An array of api routes available to the public.
 * These API routes do not require authentication.
 * @type {string}
 */
const publicApiRoutes: string[] = [
    '/api/markers/get-markers',
    '/api/users/get-usernames',
]

/**   An array of page routes available to the public.
 * These API routes do not require authentication.
 * @type {string}
 */
const publicPageRoutes: string[] = ['/', '/map']

/**   An array of routes available to the public (public api routes and public page routes).
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = publicApiRoutes.concat(publicPageRoutes)

/**   The prefix for API authentication routes.
 * Routes that start with this prefix are used for api authentication purpose.
 * @type {string}
 */
export const apiAuthprefix: string = '/api/auth/'

/**   Default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/'
