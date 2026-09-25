#!/bin/bash

# Start backend
python -m app.backend.app &

# Start frontend
cd app/frontend-react
npm run dev
