import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD8DO5nrlcSttqbx3Jjc3oHEnPKJQqoUbQ';

  constructor(private http: HttpClient) {}

  // Gemini API psychology analysis
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

  // Local mentality advice logic
  // getAdvicePoints(situation: string, mentality: string): string {
  //   switch (mentality) {
  //     case 'Gentleman':
  //       return "**Stay classy:** Greet them with respect, keep the conversation friendly, and be polite regardless of the past.";
  //     case 'Funny':
  //       return "**Use humor appropriately:** Lighten up the meeting with gentle humor, but avoid sarcasm regarding the past.";
  //     case 'Reserved':
  //       return "**Be brief:** Greet politely, but keep your interaction short and composed.";
  //     case 'Intelligent':
  //       return "**Show emotional intelligence:** Acknowledge the meeting, act understanding and mature.";
  //     case 'Broad-minded':
  //       return "**Show growth:** Embrace the situation positively; see it as a chance to demonstrate maturity.";
  //     case 'Revenge-oriented':
  //       return "**Avoid negative actions:** Acting vengeful rarely leads to growth. Channel your feelings into self-improvement.";
  //     case 'Empathetic':
  //       return "**Be understanding:** Show compassion. Empathy helps rebuild your own mental strength.";
  //     case 'Assertive':
  //       return "**Stand tall:** Greet with confidence, don’t let the past cloud your present. Set clear boundaries.";
  //     case 'Forgiving':
  //       return "**Let go:** Be friendly, forgive sincerely, and move ahead with no grudges.";
  //     default:
  //       return "React authentically according to your true values and the context.";
  //   }
  // }
  //   getAdvicePoints(situation: string, mentality: string): string {
  //     switch (mentality) {
  //       case 'Gentleman':
  //         return `
  // **Embody Gentleman Behavior in Social Situations**
  // - Greet everyone with respect and kindness.
  // - Focus on making all guests comfortable, not just any one person.
  // - Avoid negative talk about the past; be the source of positivity.
  // - Offer help to hosts or contribute to the group's wellbeing.
  // - Stay calm and collected if facing unexpected or emotional interactions.
  // - If approached, respond politely and keep conversations friendly.
  // - Remember: Dignified actions speak louder than words.
  //       `;
  //       case 'Intelligent':
  //         return `
  // **How to embody intelligent behavior in social situations:**

  // - **Prepare in advance:** Take time beforehand to reflect on your feelings and set an intention to stay calm, open-minded, and self-assured.
  // - **Arrive with presence:** Enter confidently—smile, greet others naturally, and make polite conversation with everyone you meet.
  // - **Engage wisely:** Participate in discussions thoughtfully. Ask good questions, listen actively, and contribute ideas that foster positive, meaningful dialogue.
  // - **Redirect negativity:** If uncomfortable topics arise, steer the conversation gently back to neutral or uplifting subjects.
  // - **Respect social dynamics:** Notice how others are acting; adjust your tone and responses to promote harmony—never force an interaction or over-share private details.
  // - **Show emotional maturity:** When you feel nervous or awkward, focus on your breath, use encouraging self-talk, and remind yourself of your inner growth.
  // - **Demonstrate composure:** Maintain good posture, use open body language, and show confidence through your actions.
  // - **Support others:** Offer encouragement, friendliness, and help create an inclusive, supportive atmosphere.
  // - **Exit with gratitude:** When leaving, thank the hosts or organizers, and say goodbye to those you spent time with.
  // - **Reflect afterward:** Journal about your impressions and actions. Celebrate confident moments and note any areas for continued growth in social intelligence.
  // `;

  //       case 'Funny':
  //         return `
  // **Use Humor to Bring Positivity (Appropriately)**
  // - Share light jokes or stories to include everyone, keeping humor fun and respectful.
  // - Avoid jokes that reference sensitive history or personal struggles.
  // - Observe others’ reactions and adjust your tone so all feel comfortable.
  // - Laugh with—not at—others, fostering a warm, inclusive environment.
  // - If someone is uncomfortable, switch to a more neutral topic.
  // - Use wit to create connection and joy in every interaction.
  //       `;
  //       case 'Reserved':
  //         return `
  // **Be Reserved – Calm, Thoughtful, and Self-Controlled**
  // - Choose your words carefully; let your actions speak.
  // - Greet others with politeness, but avoid over-sharing or dominating conversations.
  // - Find places to recharge if the event feels overwhelming.
  // - Engage in meaningful dialogue only if you feel comfortable.
  // - Respect all boundaries and focus on inner peace during interactions.
  // - Leave when you feel ready, not pressured.
  //       `;
  //       case 'Broad-minded':
  //         return `
  // **Model Broad-Mindedness in Social Contexts**
  // - Accept different viewpoints without judgment.
  // - Encourage inclusive conversations and diverse perspectives.
  // - Be open to learning from new experiences at every event.
  // - Respect the choices and feelings of all involved.
  // - Help mediate and resolve misunderstandings if they arise.
  // - Leave each group with a sense of connection and openness.
  //       `;
  //       case 'Revenge-oriented':
  //         return `
  // **Channel Strong Emotions into Positive Action**
  // - Avoid impulsive or damaging behavior—revenge rarely brings satisfaction.
  // - Use strong feelings as motivation for self-improvement and achievement.
  // - Maintain self-control and act in ways that reflect growth, not resentment.
  // - Focus on building your own happiness and peace, regardless of the situation.
  // - Practice forgiveness for your own wellbeing, even if you must set boundaries.
  //       `;
  //       case 'Empathetic':
  //         return `
  // **Show Empathy Toward Everyone Involved**
  // - Acknowledge the emotions and perspectives of others with compassion.
  // - Listen attentively and offer comfort if someone shares their feelings.
  // - Be present and gentle, helping others feel understood and cared for.
  // - Avoid judgment or advice unless asked.
  // - Model patience, acceptance, and kindness even in tough circumstances.
  //       `;
  //       case 'Assertive':
  //         return `
  // **Demonstrate Assertiveness with Respect**
  // - Stand tall—express your views clearly and constructively.
  // - Set boundaries for yourself politely, without aggression.
  // - Say “no” when needed, and maintain self-respect in all interactions.
  // - Communicate needs and feelings openly, but kindly.
  // - Advocate for your values or plans, and encourage dialogue.
  //       `;
  //       case 'Forgiving':
  //         return `
  // **Practice Forgiveness and Let Go**
  // - Release grudges or emotional baggage for your own peace.
  // - Treat all with friendliness, even if there's past conflict.
  // - Use this event as a chance to move forward and heal.
  // - Offer genuine well-wishes to others.
  // - Focus on growth, closure, and building healthy future relationships.
  //       `;
  //       default:
  //         return `
  // **General Wisdom**
  // - Act in ways authentic to your values, prioritizing wellbeing and growth.
  // - Treat everyone with respect, openness, and care.
  //       `;
  //     }
  //   }
  getAdvicePoints(situation: string, mentality: string): string {
    switch (mentality) {
      case 'Gentleman':
        return `
**Embody Gentleman Behavior in Social Situations**
- Greet everyone with respect and kindness.
- Focus on making all guests comfortable, not just any one person.
- Avoid negative talk about the past; be the source of positivity.
- Offer help to hosts or contribute to the group's wellbeing.
- Stay calm and collected if facing unexpected or emotional interactions.
- If approached, respond politely and keep conversations friendly.
- Remember: Dignified actions speak louder than words.
      `;
      case 'Intelligent':
        return `
**Display Emotional Intelligence & Wisdom in Social Gatherings**
- Prepare yourself: Reflect and set an intention to be calm, insightful, and constructive.
- Enter confidently, greet everyone in a warm and relaxed manner.
- Engage thoughtfully in group conversations: ask good questions, share helpful information, and listen actively.
- Steer the discussion toward positive, meaningful topics if negativity arises.
- Respect everyone's boundaries; match your engagement to the mood around you.
- Use emotional self-regulation techniques: breathe deeply, practice positive self-talk, and notice your thoughts.
- Maintain open body language and good posture—show confidence through presence.
- Support others: help bring people together, encourage healthy connections.
- Exit graciously, thank the hosts, and leave a positive impression.
- Journal afterward about what felt intelligent and what you might improve next time.
      `;
      case 'Funny':
        return `
**Use Humor to Bring Positivity (Appropriately)**
- Share light jokes or stories to include everyone, keeping humor fun and respectful.
- Avoid jokes that reference sensitive history or personal struggles.
- Observe others’ reactions and adjust your tone so all feel comfortable.
- Laugh with—not at—others, fostering a warm, inclusive environment.
- If someone is uncomfortable, switch to a more neutral topic.
- Use wit to create connection and joy in every interaction.
      `;
      case 'Reserved':
        return `
**Be Reserved – Calm, Thoughtful, and Self-Controlled**
- Choose your words carefully; let your actions speak.
- Greet others with politeness, but avoid over-sharing or dominating conversations.
- Find places to recharge if the event feels overwhelming.
- Engage in meaningful dialogue only if you feel comfortable.
- Respect all boundaries and focus on inner peace during interactions.
- Leave when you feel ready, not pressured.
      `;
      case 'Broad-minded':
        return `
**Model Broad-Mindedness in Social Contexts**
- Accept different viewpoints without judgment.
- Encourage inclusive conversations and diverse perspectives.
- Be open to learning from new experiences at every event.
- Respect the choices and feelings of all involved.
- Help mediate and resolve misunderstandings if they arise.
- Leave each group with a sense of connection and openness.
      `;
      case 'Revenge-oriented':
        return `
**Channel Strong Emotions into Positive Action**
- Avoid impulsive or damaging behavior—revenge rarely brings satisfaction.
- Use strong feelings as motivation for self-improvement and achievement.
- Maintain self-control and act in ways that reflect growth, not resentment.
- Focus on building your own happiness and peace, regardless of the situation.
- Practice forgiveness for your own wellbeing, even if you must set boundaries.
      `;
      case 'Empathetic':
        return `
**Show Empathy Toward Everyone Involved**
- Acknowledge the emotions and perspectives of others with compassion.
- Listen attentively and offer comfort if someone shares their feelings.
- Be present and gentle, helping others feel understood and cared for.
- Avoid judgment or advice unless asked.
- Model patience, acceptance, and kindness even in tough circumstances.
      `;
      case 'Assertive':
        return `
**Demonstrate Assertiveness with Respect**
- Stand tall—express your views clearly and constructively.
- Set boundaries for yourself politely, without aggression.
- Say “no” when needed, and maintain self-respect in all interactions.
- Communicate needs and feelings openly, but kindly.
- Advocate for your values or plans, and encourage dialogue.
      `;
      case 'Forgiving':
        return `
**Practice Forgiveness and Let Go**
- Release grudges or emotional baggage for your own peace.
- Treat all with friendliness, even if there's past conflict.
- Use this event as a chance to move forward and heal.
- Offer genuine well-wishes to others.
- Focus on growth, closure, and building healthy future relationships.
      `;
      default:
        return `
**General Wisdom**
- Act in ways authentic to your values, prioritizing wellbeing and growth.
- Treat everyone with respect, openness, and care.
      `;
    }
  }
}
