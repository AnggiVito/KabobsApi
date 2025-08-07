import { defineConfig } from '@adonisjs/static'

/**
 * Configuration for serving static files
 */
const staticServerConfig = defineConfig({
  /**
   * Enable or disable serving static files
   */
  enabled: true, // <--- PASTIKAN NILAI INI ADALAH 'true'

  /**
   * The root directory from which to serve static files. The URL
   * will be constructed by joining the root directory with the
   * request URL.
   */
  // publicPath: '', // Biarkan default jika file ada di folder 'public'

  /**
   * Browsers should cache static files for the following duration.
   * The value is in seconds.
   */
  maxAge: 3600,

  /**
   * The `Cache-Control` header `immutable` directive tells the browser that
   * the response body will not change over time.
   */
  immutable: false,

  /**
   * Whether to generate etag for response header or not.
   */
  etag: true,

  /**
   * Whether to set Last-Modified header on response or not.
   */
  lastModified: true,

  /**
   * The dotfiles option determines how dotfiles (files or directories that start with a dot ".") are treated.
   */
  dotFiles: 'ignore',
})

export default staticServerConfig