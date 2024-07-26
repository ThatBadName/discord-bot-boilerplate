const fs = require("fs/promises");

class AsyncFileHandler {
  // Check if a path exists
  static async exists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Read a file or directory
  static async read(filePath) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        const files = await fs.readdir(filePath);
        return {
          type: "directory",
          contents: files,
        };
      } else {
        const data = await fs.readFile(filePath, "utf8");
        return {
          type: "file",
          contents: data,
        };
      }
    } catch (error) {
      throw new Error(`Error reading ${filePath}: ${error.message}`);
    }
  }

  // Write to a file
  static async write(filePath, data) {
    try {
      await fs.writeFile(filePath, data, "utf8");
      return `File written successfully to ${filePath}`;
    } catch (error) {
      throw new Error(`Error writing to ${filePath}: ${error.message}`);
    }
  }

  // Create a directory
  static async createDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return `Directory created successfully at ${dirPath}`;
    } catch (error) {
      throw new Error(`Error creating directory ${dirPath}: ${error.message}`);
    }
  }

  static async delete(filePath) {
    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        await fs.rmdir(filePath, { recursive: true });
        return `Directory deleted successfully at ${filePath}`;
      } else {
        await fs.unlink(filePath);
        return `File deleted successfully at ${filePath}`;
      }
    } catch (error) {
      throw new Error(`Error deleting ${filePath}: ${error.message}`);
    }
  }

  static async stat(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        type: stats.isDirectory() ? "directory" : "file",
        stats,
      };
    } catch (error) {
      throw new Error(`Error getting stats for ${filePath}: ${error.message}`);
    }
  }
}

module.exports = AsyncFileHandler;
