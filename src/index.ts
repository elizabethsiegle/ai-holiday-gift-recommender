import { Hono } from 'hono';
import { html } from 'hono/html';
import { raw as unsafeHTML } from 'hono/html';
// import { GiftRecSchema, type GiftRec } from './durable-objects/GiftRecsStore';
import { nanoid } from 'nanoid';

export interface Env {
	Bindings: {
		AI: Ai;
		GIFT_LIST: DurableObjectNamespace;
		GIFT_RECS_STORE: DurableObjectNamespace;
	}
}

export { GiftListStore } from './durable-objects/GiftRecsStore';

const app = new Hono<{ Bindings: Env['Bindings'] }>();

app.get('/', (c) => {
	const snowflakes = Array(20).fill('❄️').map((_, i) => 
		`<div class="snowflake" style="left: ${i % 2 === 0 ? '5' : '95'}vw; animation-delay: ${Math.random() * 15}s">❄️</div>`
	).join('');

	return c.html(html`
		<!DOCTYPE html>
		<html>
			<head>
				<title>Santa's Little AI Helper 🎅</title>
				<style>
					body {
						margin: 0;
						font-family: system-ui;
						padding: 0;
						min-height: 100vh;
						background: linear-gradient(135deg, #1a472a, #2d5a40);
						color: white;
						position: relative;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
					.container {
						max-width: 800px;
						margin: 2rem auto;
						background: rgba(178, 34, 34, 0.15);
						padding: 2rem;
						border-radius: 12px;
						box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						color: #333;
					}
					h1 {
						text-align: center;
						font-size: 2.5rem;
						margin-bottom: 2rem;
						color: #e4002b;
						text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
					}
					form { 
						display: flex; 
						flex-direction: column; 
						gap: 1.2rem;
						align-items: center; 
						text-align: center;  
					}
					label { 
						font-weight: bold;
						display: flex;
						gap: 0.5rem;
						align-items: center;
						color: white;
						text-shadow: 0 0 5px white;
						width: 100%;
						justify-content: center;
					}
					input, select, textarea {
						padding: 0.8rem;
						margin-top: 0.25rem;
						border: 2px solid #ddd;
						border-radius: 6px;
						font-size: 1rem;
					}
					input:focus, select:focus, textarea:focus {
						outline: none;
						border-color: #e4002b;
					}
					button {
						padding: 1rem;
						background: #e4002b;
						color: white;
						border: none;
						border-radius: 8px;
						cursor: pointer;
						font-size: 1.1rem;
						font-weight: bold;
						transition: all 0.3s ease;
					}
					button:hover {
						background: #b30022;
						transform: translateY(-2px);
					}
					footer {
						text-align: center;
						padding: 1rem;
						position: relative;
						color: rgba(255, 255, 255, 0.8);
						font-size: 0.9rem;
						background-color: rgba(178, 34, 34, 0.3);
						width: 100%;
						margin-top: auto;
					}
					/* Snow animation */
					@keyframes snowfall {
						0% { 
							transform: translateY(-10vh) translateX(0); 
							opacity: 1;
						}
						100% { 
							transform: translateY(100vh) translateX(20px);
							opacity: 0.3;
						}
					}
					.snowflake {
						position: fixed;
						top: -10vh;
						animation: snowfall 15s linear infinite;
						color: white;
						opacity: 0.7;
						text-shadow: 0 0 5px white;
						pointer-events: none;
						z-index: 1;
						font-size: 24px;
					}
					.snowflake:nth-child(2n) { 
						animation-duration: 12s; 
						font-size: 16px;
					}
					.snowflake:nth-child(3n) { 
						animation-duration: 18s;
						font-size: 20px; 
					}
				</style>
			</head>
			<body>
				${unsafeHTML(snowflakes)}
				
				<div class="container">
					<h1>🎅 Santa's Gift-O-Matic 3000 🎁</h1>
					<form action="/recommend" method="POST">
						<div>
							<label>🎯 Friend's Name:</label>
							<input type="text" id="name" name="name" required>
						</div>
						
						<div>
							<label>🎂 Age:</label>
							<input type="number" id="age" name="age" required min="1" max="120">
						</div>
						
						<div>
							<label>👤 Gender:</label>
							<select id="gender" name="gender" required>
								<option value="">Select one...</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="non-binary">Non-binary</option>
								<option value="other">Other</option>
							</select>
						</div>
						
						<div>
							<label>📍 Location:</label>
							<input type="text" id="location" name="location" required>
						</div>
						
						<div>
							<label>🎨 Interests:</label>
							<textarea id="interests" name="interests" required></textarea>
						</div>
						
						<div>
							<label>🎬 Favorite Movie:</label>
							<input type="text" id="movie" name="movie" required>
						</div>
						
						<div>
							<label>⚡ Dream Superpower:</label>
							<input type="text" id="superpower" name="superpower" required>
						</div>
						
						<div>
							<label>🍳 Go-to Breakfast:</label>
							<input type="text" id="breakfast" name="breakfast" required>
						</div>
						
						<div>
							<label>🦁 Spirit Animal:</label>
							<input type="text" id="spirit-animal" name="spirit-animal" required>
						</div>

						<button type="submit">✨ Work Your Magic, Santa! 🎄</button>
					</form>
				</div>
				<footer>
                    Made w/ ❤️ using <a href="https://developers.cloudflare.com/workers-ai/" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        Cloudflare Workers AI
                    </a> -> 
                    <a href="https://github.com/elizabethsiegle/ai-holiday-gift-recommender" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        GitHub
                    </a>
                </footer>
			</body>
		</html>
	`)
})

app.post('/recommend', async (c) => {
	const formData = await c.req.parseBody();
	const snowflakes = Array(20).fill('❄️').map((_, i) => 
		`<div class="snowflake" style="left: ${i % 2 === 0 ? '5' : '95'}vw; animation-delay: ${Math.random() * 15}s">❄️</div>`
	).join('');
	
	const messages = [
		{ role: "system", content: "You are Santa's AI helper, specializing in thoughtful gift recommendations." },
		{
			role: "user",
			content: `Based on this information about my friend, suggest 3 unique and thoughtful gift ideas:
			Name: ${formData.name}
			Age: ${formData.age}
			Gender: ${formData.gender}
			Location: ${formData.location}
			Interests: ${formData.interests}
			Favorite Movie: ${formData.movie}
			Desired Superpower: ${formData.superpower}
			Breakfast Choice: ${formData.breakfast}
			Spirit Animal: ${formData['spirit-animal']}
			
			Please provide only a list of 3 gift suggestions and nothing else, no preamble and no explanations. Just the gift ideas.`
		}
	];

	const response = await (c.env.AI.run as any)('@cf/meta/llama-3.2-3b-instruct', { 
		messages
	});

	const giftList = c.env.GIFT_LIST.idFromName('global');
	const giftObj = await c.env.GIFT_LIST.get(giftList);
	
	// Log before saving
	const giftData = {
		friendName: formData.name,
		recommendations: response.response.split('\n'),
		timestamp: new Date().toISOString()
	};
	console.log('Saving to DO:', giftData);

	// Save to Durable Object
	const result = await giftObj.fetch(new URL('/gifts','http://localhost').href, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(giftData)
	});
	
	console.log('DO save response:', await result.text());
	
	return c.html(html`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Gift Recommendations for ${formData.name} 🎁</title>
                <style>
                                    body {
                    margin: 0;
                    font-family: system-ui;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a472a, #2d5a40);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    position: relative;     /* Added */
                }
                .container {
                    max-width: 800px;
                    margin: 2rem auto;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    color: #333;
                    flex: 1;
                    display: flex;          /* Added */
                    flex-direction: column;  /* Added */
                }
                footer {
                    text-align: center;
                    padding: 1rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                    background-color: rgba(178, 34, 34, 0.3);
                    width: 100%;
                    margin-top: auto;
                }
                    h1 {
                        text-align: center;
                        color: #e4002b;
                        margin-bottom: 2rem;
                    }
                    .recommendations {
                        list-style: none;
                        padding: 0;
                    }
                    .recommendations li {
                        padding: 1rem;
                        margin: 1rem 0;
                        background: rgba(178, 34, 34, 0.1);
                        border-radius: 8px;
                        font-size: 1.1rem;
                    }
                    .back-button {
                        display: inline-block;
                        padding: 0.8rem 1.5rem;
                        background: #e4002b;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        margin-top: 1rem;
                        transition: all 0.3s ease;
                    }
                    .back-button:hover {
                        background: #b30022;
                        transform: translateY(-2px);
                    }
					.recommendation-item {
						padding: 1rem;
						margin: 0.5rem 0;
						background: rgba(178, 34, 34, 0.1);
						border-radius: 8px;
						font-size: 1.1rem;
					}
					.button-container {
						display: flex;
						gap: 1rem;
						margin-top: 2rem;
						justify-content: center;
					}
					.history-button {
						display: inline-block;
						padding: 0.8rem 1.5rem;
						background: #2d5a40;
						color: white;
						text-decoration: none;
						border-radius: 8px;
						transition: all 0.3s ease;
					}
					.history-button:hover {
						background: #1a472a;
						transform: translateY(-2px);
					}
					
					/* Snow animation */
					@keyframes snowfall {
						0% { 
							transform: translateY(-10vh) translateX(0); 
							opacity: 1;
						}
						100% { 
							transform: translateY(100vh) translateX(20px);
							opacity: 0.3;
						}
					}
					.snowflake {
						position: fixed;
						top: -10vh;
						animation: snowfall 15s linear infinite;
						color: white;
						opacity: 0.7;
						text-shadow: 0 0 5px white;
						pointer-events: none;
						z-index: 1;
						font-size: 24px;
					}
					.snowflake:nth-child(2n) { 
						animation-duration: 12s; 
						font-size: 16px;
					}
					.snowflake:nth-child(3n) { 
						animation-duration: 18s;
						font-size: 20px; 
					}
                </style>
            </head>
            <body>
			${unsafeHTML(snowflakes)}
                <div class="container">
                    <h1>🎁 Gift Ideas for ${formData.name}</h1>
                    <pre class="recommendations">
                        ${response.response.trim()}
                    </pre>
                    <div class="button-container">
                        <a href="/" class="back-button">🎅 Back to Gift-O-Matic</a>
                        <a href="/history" class="history-button">📜 View All Recommendations</a>
                    </div>
                </div>
				<footer>
                    Made w/ ❤️ using <a href="https://developers.cloudflare.com/workers-ai/" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        Cloudflare Workers AI
                    </a> -> 
                    <a href="https://github.com/elizabethsiegle/ai-holiday-gift-recommender" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        GitHub
                    </a>
                </footer>
            </body>
        </html>
    `);
});

interface GiftHistory {
    friendName: string;
    recommendations: string[];
    timestamp: string;
}

app.get('/history', async (c) => {
	const snowflakes = Array(20).fill('❄️').map((_, i) => 
		`<div class="snowflake" style="left: ${i % 2 === 0 ? '5' : '95'}vw; animation-delay: ${Math.random() * 15}s">❄️</div>`
	).join('');
	const giftList = c.env.GIFT_LIST.idFromName('global');
	const giftObj = await c.env.GIFT_LIST.get(giftList);
	
	const response = await giftObj.fetch(new URL('/gifts', 'http://localhost').href);
	console.log('DO fetch response status:', response.status);
	
	const history = await response.json() as GiftHistory[];
	console.log('Retrieved history:', history);

	/* 
		* This section uses unsafeHTML to properly render HTML content instead of escaping it.
		* 1. unsafeHTML wrapper: Prevents the HTML from being displayed as text
		* 2. Regular template literals (``) for inner HTML: Allows proper string interpolation
		* 3. Data cleaning: Filters out unwanted text and formats recommendations
		* 4. Semantic HTML: Uses proper list elements (ol, ul, li) for accessibility
	*/
	return c.html(html`
		<!DOCTYPE html>
		<html>
			<head>
				<title>Gift Recommendation History 📜</title>
				<style>
					body {
                        margin: 0;
                        font-family: system-ui;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #1a472a, #2d5a40);
                        color: white;
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                    }
                    .container {
                        max-width: 800px;
                        margin: 2rem auto;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 2rem;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        color: #333;
                        flex: 1;
                    }
                    footer {
                        text-align: center;
                        padding: 1rem;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 0.9rem;
                        background-color: rgba(178, 34, 34, 0.3);
                        width: 100%;
                        margin-top: auto;
                        position: sticky;
                        bottom: 0;
                    }
					.history-list {
						list-style: decimal;
						padding-left: 2rem;
					}
					.history-item {
						margin-bottom: 2rem;
						padding: 1rem;
						background: rgba(255, 255, 255, 0.95);
						border-radius: 8px;
					}
					.friend-name {
						font-weight: bold;
						color: #2d5a40;
						font-size: 1.2rem;
					}
					.timestamp {
						color: #666;
						font-size: 0.9rem;
						margin-bottom: 1rem;
					}
					.recommendations {
						list-style: disc;
						padding-left: 2rem;
					}
					.recommendation-item {
						padding: 0.5rem;
						margin: 0.5rem 0;
						background: rgba(45, 90, 64, 0.1);
						border-radius: 6px;
					}
				
					/* Snow animation */
					@keyframes snowfall {
						0% { 
							transform: translateY(-10vh) translateX(0); 
							opacity: 1;
						}
						100% { 
							transform: translateY(100vh) translateX(20px);
							opacity: 0.3;
						}
					}
					.snowflake {
						position: fixed;
						top: -10vh;
						animation: snowfall 15s linear infinite;
						color: white;
						opacity: 0.7;
						text-shadow: 0 0 5px white;
						pointer-events: none;
						z-index: 1;
						font-size: 24px;
					}
					.snowflake:nth-child(2n) { 
						animation-duration: 12s; 
						font-size: 16px;
					}
					.snowflake:nth-child(3n) { 
						animation-duration: 18s;
						font-size: 20px; 
					}
				</style>
			</head>
			<body>
			${unsafeHTML(snowflakes)}
				<div class="container">
					<h1>📜 Gift Recommendation History</h1>
					${unsafeHTML(`
						<ol class="history-list">
							${history.reverse().map((item: GiftHistory) => {
								const cleanRecs = item.recommendations
									.filter(rec => rec.trim() && !rec.includes('Here are 3 gift ideas'))
									.map(rec => rec.trim().replace(/^\d+\.\s*/, ''));

								return `
									<li class="history-item">
										<div class="friend-name">${item.friendName}</div>
										<div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
										<ul class="recommendations">
											${cleanRecs.map(rec => 
												`<li class="recommendation-item">${rec}</li>`
											).join('')}
										</ul>
									</li>
								`;
							}).join('')}
						</ol>
					`)}
					<div class="button-container">
                        <a href="/" class="back-button">🎅 Back to Gift-O-Matic</a>
                    </div>
				</div>
				<footer>
                    Made w/ ❤️ using <a href="https://developers.cloudflare.com/workers-ai/" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        Cloudflare Workers AI
                    </a> -> 
                    <a href="https://github.com/elizabethsiegle/ai-holiday-gift-recommender" 
                       style="color: white; text-decoration: underline;"
                       target="_blank">
                        GitHub
                    </a>
                </footer>
			</body>
		</html>
	`);
});

app.post('/api/save-recommendations', async (c) => {
	const body = await c.req.json();
	
	const giftId = nanoid();
	const giftRec = {
		friendName: body.recipient,
		recommendations: body.generatedGifts,
		timestamp: new Date().toISOString()
	};

	const id = c.env.GIFT_LIST.idFromName(giftId);
	const obj = c.env.GIFT_LIST.get(id);
	
	const response = await obj.fetch(new URL('/gifts', 'http://localhost').href, {
		method: 'POST',
		body: JSON.stringify(giftRec)
	});

	if (!response.ok) {
		return c.json({ error: 'Failed to save recommendations' }, 500);
	}

	return c.json(giftRec);
});

//UNCOMMENT TO LET PEOPLE HIT CLEAR HISTORY
// app.get('/clear-history', async (c) => {
//     const giftList = c.env.GIFT_LIST.idFromName('global');
//     const giftObj = await c.env.GIFT_LIST.get(giftList);
    
//     await giftObj.fetch(new URL('/clear-history', 'http://localhost').href, {
//         method: 'DELETE'
//     });
    
//     return c.text('History cleared');
// });


export default app;
