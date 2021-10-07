import { Octokit } from "./index.js";
import {
  ArgumentsTypesForRoute,
  VersionsByRoute,
  AllKnownRoutes,
  ParametersByVersionAndRoute,
  RequestByVersionAndRoute,
} from "./utils";

/**
 * Generic request options as they are returned by the `endpoint()` method
 */
type GenericRequestOptions = {
  method: Octokit.RequestMethod;
  url: string;
  headers: Octokit.RequestHeaders;
  data?: unknown;
  request?: Octokit.RequestOptions;
};

type EndpointParameters<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> = { request?: Octokit.RequestOptions<TVersion> } & Record<string, unknown>;

/**
 * The `EndpointInterface` is used for both the standalone `@octokit-next/endpoint` module
 * as well as `@octokit-next/core`'s `.endpoint()` method.
 *
 * It has 3 overrides
 *
 * 1. When passing `{ request: { version }}` as part of the parameters, the passed version
 *    is used as a base for the types of the remaining parameters and the response
 * 2. When a known route is passed, the types for the parameters and the response are
 *    derived from the version passed in `EndpointInterface<version>`, which defaults to `"github.com"`
 * 3. When no endpoint types are imported, then any route with any parameters can be passed in, and the response is unknown.
 */
export interface EndpointInterface<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> {
  /**
   * Send a request to a known endpoint for the version specified in `request.version`.
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends AllKnownRoutes, RVersion extends VersionsByRoute[Route]>(
    route: Route,
    options: {
      request: {
        version: RVersion;
      };
    } & (Route extends keyof ParametersByVersionAndRoute[RVersion]
      ? ParametersByVersionAndRoute[RVersion][Route]
      : never)
  ): Route extends keyof RequestByVersionAndRoute[RVersion]
    ? RequestByVersionAndRoute[RVersion][Route]
    : never;

  /**
   * Send a request to a known endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends AllKnownRoutes>(
    ...options: ArgumentsTypesForRoute<
      Route,
      // if given route is supported by current version
      TVersion extends keyof ParametersByVersionAndRoute
        ? // then set parameter types based on version and route
          Route extends keyof ParametersByVersionAndRoute[TVersion]
          ? ParametersByVersionAndRoute[TVersion][Route]
          : // otherwise set parameter types to { request: { version } } where
            // version must be set to one of the supported versions for the route.
            // Once that happened, the above override will take over and require
            // the types for the remaining options.
            {
              request: {
                version: VersionsByRoute[Route];
              };
            }
        : never
    >
  ): Route extends keyof RequestByVersionAndRoute[TVersion]
    ? RequestByVersionAndRoute[TVersion][Route]
    : never;

  /**
   * It looks like you haven't imported any `@octokit-next/types-rest-api*` packages yet.
   * You are missing out!
   *
   * Install `@octokit-next/types-rest-api` and import the types to give it a try.
   * Learn more at https://github.com/octokit/types-rest-api.ts
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    ...options: keyof Octokit.Endpoints extends never
      ? [Route, Record<string, unknown>?]
      : []
  ): GenericRequestOptions;
}
