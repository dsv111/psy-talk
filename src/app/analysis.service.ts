import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD8DO5nrlcSttqbx3Jjc3oHEnPKJQqoUbQ';

  constructor(private http: HttpClient) {}

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

  getAdvicePoints(situation: string, mentality: string): string {
    // Extract notable words for more relatable suggestions
    const extractEntities = (str: string) => {
      const matches = str.match(/\b[A-Z][a-z]*\b/g) || [];
      // Only use the first match as mainEntity for clarity
      return matches.length ? matches[0] : null;
    };
    const mainEntity = extractEntities(situation) || "the other person";
    // Contextual fallback for the event/meeting
    const eventOrMeeting =
      /(meeting|event|function|gathering|discussion|interaction|occasion)/i.exec(
        situation
      )?.[0] || "the situation";

    switch (mentality) {
      case "Funny":
        return `
**How to Add Humor in ${eventOrMeeting}:**
- Start with a genuine smile and perhaps a light-hearted comment open to all.
- If someone seems tense, try a situational pun, e.g., "I think ${eventOrMeeting} just got 30% brighter!"
- Use body language: playful hand gestures or animated expressions to bring positivity.
- Suggest an activity or brief game to lighten the mood.
- Make gentle, universal jokes (nothing personal or sensitive) to break the ice.
- End by inviting others to share their funniest recent story—it shows you're approachable and fun.
        `;

      case "Gentleman":
        return `
**Gentleman Approach in ${eventOrMeeting}:**
- Greet ${mainEntity} and others respectfully, with confident posture.
- Offer assistance if someone looks like they need help (e.g. with directions or tasks).
- If the atmosphere gets intense, gently steer the conversation to positive or common ground.
- Compliment others for their organization, ideas, or contributions.
- Thank everyone sincerely for their time or company before leaving.
        `;

      case "Intelligent":
        return `
**Intelligent Strategies for ${eventOrMeeting}:**
- Observe first; contribute to discussions thoughtfully, referencing anything relevant from the situation.
- Ask thought-provoking, open-ended questions on the topic at hand.
- Offer a gentle insight if an awkward moment occurs, e.g., "It's always valuable to hear many perspectives."
- Use calm, precise gestures, and make eye contact to show engagement.
- Afterward, reflect on two smart moves you made, or new things you learned about the people/process.
        `;

      case "Reserved":
        return `
**Reserved But Present in ${eventOrMeeting}:**
- Enter quietly, choosing a spot where you can observe most of the group.
- Listen actively, nodding or smiling to show engagement.
- Speak briefly and only when comfortable—let others lead conversations.
- If someone approaches, acknowledge warmly but don't feel pressured to over-share.
- If you need a break, excuse yourself calmly and return if you feel ready.
        `;

      case "Broad-minded":
        return `
**Broad-minded Presence in ${eventOrMeeting}:**
- Initiate inclusive conversations, inviting quieter members to share their thoughts.
- Express openness: "I'm curious to hear your experience on this."
- If a disagreement arises, say, "I appreciate different perspectives, it makes this richer."
- Try something new if the opportunity comes up—modeling flexible thinking for others.
        `;

      case "Revenge-oriented":
        return `
**Transforming Strong Feelings in ${eventOrMeeting}:**
- Channel intense emotion into constructive action, like excelling at a given task or assisting someone.
- Maintain composure—keep body language open and unfazed.
- If provoked, respond neutrally and re-focus energy on your own goals.
- Use your presence to set an example of resilience, rather than reaction.
        `;

      case "Empathetic":
        return `
**Empathetic Moves in ${eventOrMeeting}:**
- Notice body language; if someone looks uncomfortable, check in: "Are you okay with everything here?"
- Acknowledge and validate group feelings: "It's normal to feel a bit tense sometimes."
- Offer supportive nonverbal cues—a nod, gentle smile, or encouraging gesture.
- If needed, be a calm mediator and help resolve misunderstandings gently.
        `;

      case "Assertive":
        return `
**Assertive Practices for ${eventOrMeeting}:**
- State your needs or opinions clearly and respectfully: "I think we could try this approach."
- Maintain confident body posture (upright, open arms).
- If interrupted, calmly say, "Let me finish, then I'd love your thoughts."
- Set boundaries if the situation turns uncomfortable, using firm but kind language.
        `;

      case "Forgiving":
        return `
**Forgiveness in Action During ${eventOrMeeting}:**
- Greet everyone openly, even if past tensions exist.
- If a misunderstanding resurfaces, say, "I’d rather focus on moving forward today."
- Join group activities to show willingness to participate equally.
- Express genuine goodwill as the meeting ends: "I'm glad we could all come together."
        `;

      default:
        return `
**General Steps for ${eventOrMeeting}:**
- Be present, listen, and interact in ways that match your values.
- Treat all participants with respect and openness.
        `;
    }
  }
}
