import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD8DO5nrlcSttqbx3Jjc3oHEnPKJQqoUbQ';

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
`
            }
          ]
        }
      ]
    };

    return this.http.post<any>(this.GEMINI_API_URL, body).pipe(
      map((response) => {
        // Find the markdown code block (JSON) in Gemini's reply and parse it
        const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Extract JSON object from markdown or plain text
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: raw };
      })
    );
  }
}
