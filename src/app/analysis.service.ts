import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD8DO5nrlcSttqbx3Jjc3oHEnPKJQqoUbQ';

  constructor(private http: HttpClient) {}

  // Gemini AI psychology analysis
  analyzeSituation(text: string) {
    const body = {
      contents: [
        {
          parts: [
            {
              text: `
Please perform a comprehensive psychology assistant analysis for the following input. 
Respond in this JSON structure:
{
  "emotions": [Detected main emotions],
  "summary": "Short summary of the situation",
  "suggestions": [Practical suggestions],
  "example": "Relatable scenario",
  "psychology": "Brief psychology insight",
  "positive": "Gentle positive supportive closing"
}
Input: "${text}"
`,
            },
          ],
        },
      ],
    };

    return this.http.post<any>(this.GEMINI_API_URL, body).pipe(
      map((response) => {
        const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: raw };
      })
    );
  }

  // Point-wise creative advice, contextual to input and mentality
  getAdvicePoints(situation: string, mentality: string): string {
    // Attempt to extract names and event keywords for context
    const nameMatch = situation.match(/\b([A-Z][a-z]*)\b/g);
    const eventMatch = /(birthday|party|function|wedding|reunion|meeting)/i.exec(situation);
    const mainName = nameMatch?.[0] || "your friend";
    const hostName = nameMatch?.[1] || "the host";
    const eventName = eventMatch?.[0] || "the event";

    switch (mentality) {
      case "Funny":
        return `
**How to bring humor when you meet ${mainName} at ${eventName}:**

- Upon meeting, greet with a smile and say: "${mainName}, it’s not a ${eventName} until you arrive—${hostName}'s party vibe just doubled!"
- When the cake is brought out, joke: "${hostName}, don’t worry, we only put half the candles this year to avoid a fire hazard!"
- During group selfies, strike a silly pose and say: "Let’s make this the most memorable awkward group photo ever!"
- During games, suggest a playful penalty: "Loser sings a birthday rap for ${hostName}, no escape!"
- If anyone seems distant, break the ice with: "It’s scientifically proven that friends at birthdays are 70% happier—should we test it?"
- End the event saying: "${hostName}, thanks for uniting legends (and chaos) under one roof—next year, more cake, less wisdom!"
`;

      case "Gentleman":
        return `
**Tips for Gentleman Behavior at ${eventName}:**

- Dress neatly for ${hostName}'s ${eventName}; offer help if you see setup tasks.
- Greet ${mainName} first with: "Hi ${mainName}, great to see you!"
- Compliment ${hostName}: "${hostName}, you always make everyone feel special at your parties."
- Hold the door or help serve snacks if needed.
- If the conversation gets tough, steer it back kindly: "Let’s focus on celebrating ${hostName} tonight!"
- Before leaving: "Thank you, ${hostName}, for a wonderful evening—looking forward to our next get-together."
`;

      case "Intelligent":
        return `
**Intelligent Ways to Navigate ${hostName}'s ${eventName}:**

- Break the ice with: "Any predictions for what fun drama will happen tonight?"
- In a group, introduce thoughtful games: "What's the best lesson you learned this year, ${hostName}?"
- Ask ${mainName}: "Did you try the new cake? I read desserts are scientifically proven mood boosters!"
- Diffuse tense moments: "Let's share one positive thing about today."
- After the party, jot down: "How did I help make the event a great experience for all?"
`;

      case "Reserved":
        return `
**Reserved but Friendly at ${eventName}:**

- Send ${hostName} a birthday wish on arrival, keep conversation brief.
- Find a cozy spot and enjoy watching the festivities quietly.
- If approached by ${mainName}, say: "Just happy to be here and see everyone celebrating."
- Join games only if you feel like it—it’s okay to observe.
- As you leave, thank ${hostName}: "Thanks ${hostName}, I had a nice time."
`;

      case "Broad-minded":
        return `
**Broad-minded Moves for ${eventName}:**

- Invite someone new into your group: "Hey, have you met ${mainName} yet?"
- Ask ${hostName}: "What's the most unusual tradition you've seen at a birthday?"
- Try different food/games: "This cake decorating contest is wild!"
- If friends disagree: "Parties are for celebrating differences too!"
`;

      case "Revenge-oriented":
        return `
**Channel Strong Feelings Without Conflict:**

- If you feel upset, use humor or actions to stand out positively: "Next time, challenge us to a bake-off, not drama-off!"
- Focus on winning games or complimenting ${hostName}.
- Ignore provocations; instead, say "${hostName}, awesome job today—you deserve all the cake!"
`;

      case "Empathetic":
        return `
**Empathetic Actions at ${eventName}:**

- Notice if anyone (including ${mainName}) seems left out: "Join us for this game, it's more fun together!"
- If a friend shares worries: "I get it, birthdays bring up all sorts of feelings."
- Thank ${hostName}: "You make everyone feel welcome tonight."
`;

      case "Assertive":
        return `
**How to be Assertive at ${eventName}:**

- State your game preference: "Let's start with karaoke, I've been practicing for this!"
- If conversation makes you uncomfortable: "Can we switch topics?"
- Ensure your ideas for activities are heard.
- If leaving early: "I've had a great time. Thanks for the invite, ${hostName}!"
`;

      case "Forgiving":
        return `
**Forgiveness in Action at ${eventName}:**

- If you see ${mainName} after a disagreement: "Good to see you, hope you enjoy the party."
- Join fun activities to make new memories, not dwell on the past.
- End the evening: "${hostName}, this party was awesome—here's to more laughter and no regrets!"
`;

      default:
        return `
**General Wisdom at ${eventName}:**
- Act in ways authentic to your values, prioritizing wellbeing and growth.
- Treat everyone with respect, openness, and care.
`;
    }
  }
}
