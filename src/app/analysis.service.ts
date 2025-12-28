import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Diary entry model
export interface DiaryEntry {
  date: string;
  text: string;
  mood?: string;
}

// SSR/localStorage protection utility
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAg0HoiyqmY3ceq7_8J5WjsGvFz9Q7ovL0';
  private diaryKey = 'psyTalkDiary';

  constructor(private http: HttpClient) {}

  // --- Gemini psychology analysis ---
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

  // --- Diary Storage Methods (array) ---
  getDiaryEntries(): DiaryEntry[] {
    if (!isBrowser()) {
      return [];
    }
    const raw = localStorage.getItem(this.diaryKey);
    return raw ? JSON.parse(raw) : [];
  }

  getDiaryEntry(date: string): DiaryEntry | null {
    const entries = this.getDiaryEntries();
    return entries.find((entry) => entry.date === date) || null;
  }

  addDiaryEntry(entry: DiaryEntry) {
    if (!isBrowser()) return;
    const entries = this.getDiaryEntries();
    const index = entries.findIndex((e) => e.date === entry.date);
    if (index !== -1) {
      // Update existing
      entries[index] = entry;
    } else {
      // Add new
      entries.unshift(entry);
    }
    localStorage.setItem(this.diaryKey, JSON.stringify(entries));
  }

  deleteDiaryEntry(date: string) {
    if (!isBrowser()) return;
    const entries = this.getDiaryEntries().filter((e) => e.date !== date);
    localStorage.setItem(this.diaryKey, JSON.stringify(entries));
  }

  // --- Context-Aware Advice ---
  getAdvicePoints(situation: string, mentality: string): string {
    // Entity extraction for personalization
    const extractEntities = (str: string) => {
      const matches = str.match(/\b[A-Z][a-z]*\b/g) || [];
      return matches.length ? matches[0] : null;
    };
    const mainEntity = extractEntities(situation) || 'the other person';
    const eventOrMeeting =
      /(meeting|event|function|gathering|discussion|interaction|occasion)/i.exec(
        situation
      )?.[0] || 'the situation';

    switch (mentality) {
      case 'Funny':
        return `
**How to Add Humor in ${eventOrMeeting}:**
- Start with a genuine smile and perhaps a light-hearted comment open to all.
- If someone seems tense, try a situational pun, e.g., "I think ${eventOrMeeting} just got 30% brighter!"
- Use body language: playful hand gestures or animated expressions to bring positivity.
- Suggest an activity or brief game to lighten the mood.
- Make gentle, universal jokes (nothing personal or sensitive) to break the ice.
- End by inviting others to share their funniest recent story—it shows you're approachable and fun.
        `;
      case 'Gentleman':
        return `
**Gentleman Approach in ${eventOrMeeting}:**
- Greet ${mainEntity} and others respectfully, using confident posture.
- Offer assistance if someone seems to need help (directions, tasks, introductions).
- If the mood shifts, gently steer the conversation toward positive or neutral topics.
- Compliment contributions or thoughtfulness in ${eventOrMeeting}.
- Thank hosts or participants sincerely before leaving.
        `;
      case 'Intelligent':
        return `
**Intelligent Strategies for ${eventOrMeeting}:**
- Observe first; contribute thoughtful opinions or references relevant to the topic.
- Ask open-ended questions to foster deeper discussion.
- Offer insights or solutions gently if awkward moments occur.
- Use calm, precise gestures and maintain eye contact to show engagement.
- Afterward, reflect on your most constructive contribution or learning.
        `;
      case 'Reserved':
        return `
**Reserved But Present in ${eventOrMeeting}:**
- Enter quietly, find a comfortable spot to observe and listen.
- Nod, smile, and confirm others’ contributions with simple affirmations.
- Speak only when moved or asked; let others lead the conversation.
- Politely excuse yourself if overwhelmed or needing a break.
- Participate in ways that fit your comfort zone.
        `;
      case 'Broad-minded':
        return `
**Broad-minded Presence in ${eventOrMeeting}:**
- Invite all voices and perspectives: "I'm interested to hear everyone's view."
- If disagreement arises, say "Diverse ideas make this richer."
- Try or support new activities, promoting openness and flexibility.
- Help maintain a welcoming, inclusive atmosphere.
        `;
      case 'Revenge-oriented':
        return `
**Transforming Strong Feelings in ${eventOrMeeting}:**
- Use any intense emotion to focus on personal achievement—not conflict.
- Present yourself calmly and confidently, making no reaction to provocation.
- Stay goal-focused and exemplify resilience.
        `;
      case 'Empathetic':
        return `
**Empathetic Moves in ${eventOrMeeting}:**
- Recognize if anyone is uncomfortable and offer support: "Is everyone ok?"
- Validate group feelings as normal and understandable.
- Use supportive gestures—gentle nods, smiles, open posture.
- Help mediate gently if misunderstandings arise.
        `;
      case 'Assertive':
        return `
**Assertive Practices for ${eventOrMeeting}:**
- Express your needs or opinions clearly, making space for others too.
- Maintain confident, open body language.
- Politely assert yourself in conversation—"I'd like to share my thought on that."
- Set boundaries firmly, but respectfully.
        `;
      case 'Forgiving':
        return `
**Forgiveness in Action During ${eventOrMeeting}:**
- Greet all openly, regardless of past issues.
- Divert conversations toward positive, forward-moving topics.
- Join in activities to show goodwill.
- End with a genuine, encouraging closing remark.
        `;
      default:
        return `
**General Steps for ${eventOrMeeting}:**
- Be present, listen deeply, act with your best values.
- Treat all with openness and respect.
        `;
    }
  }
}
