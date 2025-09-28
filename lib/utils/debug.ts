// Server-side debug logging utility
export const debugLog = async (message: string, data?: any) => {
  if (typeof window === "undefined") {
    // Server-side logging
    console.log("=== DEBUG ===");
    console.log("Message:", message);
    if (data) {
      console.log("Data:", JSON.stringify(data, null, 2));
    }
    console.log("=============");
  } else {
    // Client-side logging to server
    try {
      await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send debug log to server:", error);
    }
  }
};
