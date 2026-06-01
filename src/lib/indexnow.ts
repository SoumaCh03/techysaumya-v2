export async function pingIndexNow(urls: string[]) {
  const host = "saumyadeep.co.in";
  const key = "89fca6d3c7b2432a9e52e2bf6cd4e9c7";
  const keyLocation = `https://${host}/${key}.txt`;

  if (!urls || urls.length === 0) {
    return { success: false, message: "No URLs provided" };
  }

  // Prepend host to relative URLs if necessary
  const formattedUrls = urls.map(url => {
    if (url.startsWith("/")) {
      return `https://${host}${url}`;
    }
    return url;
  });

  const payload = {
    host,
    key,
    keyLocation,
    urlList: formattedUrls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Successfully pinged IndexNow for URLs: ${formattedUrls.join(", ")}`);
      return { success: true, status: response.status };
    } else {
      const errorText = await response.text();
      console.error(`IndexNow ping failed with status ${response.status}: ${errorText}`);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.error("Error pinging IndexNow:", error);
    return { success: false, error: String(error) };
  }
}
