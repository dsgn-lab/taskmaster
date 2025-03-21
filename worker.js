export default {
  async fetch(request, env) {
    try {
      // Parse incoming JSON request
      const { title, description, assignee, priority, due_date, tags } = await request.json();

      // Get environment variables
      const CLICKUP_API_KEY = env.CLICKUP_API_KEY;
      const LIST_ID = env.CLICKUP_LIST_ID;

      if (!CLICKUP_API_KEY || !LIST_ID) {
        return new Response("Missing API Key or List ID", { status: 500 });
      }

      // ClickUp API endpoint
      const clickUpURL = `https://api.clickup.com/api/v2/list/${LIST_ID}/task`;

      // Construct the API request payload
      const payload = {
        name: title,
        description: description,
        assignees: assignee ? [assignee] : [],
        priority: priority || 3, // Default to Medium Priority
        due_date: due_date ? new Date(due_date).getTime() : null,
        tags: tags || [],
        status: "Ready"
      };

      // Send the request to ClickUp API
      const response = await fetch(clickUpURL, {
        method: "POST",
        headers: {
          "Authorization": CLICKUP_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Return the response from ClickUp
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: response.status });

    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
