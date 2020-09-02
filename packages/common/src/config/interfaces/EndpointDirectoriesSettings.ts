export interface EndpointDirectoriesSettings {
  [endpoint: string]: any | string | (any | string)[];
}

/**
 * @deprecated Use EndpointDirectoriesSettings interface instead
 */
export interface IServerMountDirectories extends EndpointDirectoriesSettings {}
