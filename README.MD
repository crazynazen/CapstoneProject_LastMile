# SmartLearning.ai

## How to run the backend
1. Open the terminal inside the folder `backend`.
2. make a virtual environment: `python -m venv venv`
3. Activate venv: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install requirements: `pip install -r requirements.txt`
5. Make a file `.env` based `.env.example` and fill the API Key with your's Gemini API Key.
6. Run the server: `python -m uvicorn app.main:app --reload`

## How to run the frontend
1. Open the terminal inside the folder `frontend`.
2. Install dependancy: `npm install`
3. Run the server localy: `npm run dev`