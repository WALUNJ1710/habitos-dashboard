import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  type: "plan_day" | "breakdown_task" | "suggest_tasks";
  context?: string;
  taskTitle?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context, taskTitle } = await req.json() as RequestBody;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "plan_day":
        systemPrompt = `You are a productivity assistant helping users plan their day. 
        Based on the user's context (existing tasks, habits, goals), create a structured daily plan.
        Be specific with time blocks and prioritize important tasks.
        Format your response as a clear, actionable schedule.`;
        userPrompt = context || "Help me plan my day effectively.";
        break;

      case "breakdown_task":
        systemPrompt = `You are a task breakdown specialist. Given a complex task, break it down into smaller, 
        actionable subtasks. Each subtask should be specific, measurable, and achievable.
        Return a JSON array of subtasks with the format: [{"title": "subtask name"}]`;
        userPrompt = `Break down this task into subtasks: "${taskTitle}"`;
        break;

      case "suggest_tasks":
        systemPrompt = `You are a productivity coach. Based on the user's goals and current tasks, 
        suggest new tasks they might want to add. Be creative but practical.
        Return a JSON array with format: [{"title": "task name", "priority": "low|medium|high", "category": "work|personal|health|learning"}]`;
        userPrompt = context || "Suggest some tasks to help me be more productive.";
        break;

      default:
        throw new Error("Invalid request type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
