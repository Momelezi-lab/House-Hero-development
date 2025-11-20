# Migration Plan: Flask/Vanilla JS → FastAPI/React+TypeScript

## Project Structure

```
house-hero-app-v2/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI app entry point
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── routes/       # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/            # React + TypeScript
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   ├── store/       # Zustand stores
    │   ├── api/         # API client & queries
    │   ├── types/       # TypeScript types
    │   ├── utils/       # Utilities
    │   └── App.tsx
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Migration Steps

1. ✅ Set up new project structure
2. ⏳ Create FastAPI backend with models
3. ⏳ Convert all API endpoints
4. ⏳ Set up React + TypeScript frontend
5. ⏳ Convert pages to React components
6. ⏳ Set up state management
7. ⏳ Migrate email functionality
8. ⏳ Testing and deployment

