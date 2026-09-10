import type { Application, Router } from 'express';
import type { CorsOptions, HealthRequest, HealthResponse } from './types';
const { supplierAHotels, supplierBHotels } = require('./mock/supplierData.ts');

const http = require('http');
const fs = require('fs');
const path = require('path');
const port: number = 8000;
const express: typeof import('express') = require('express');
const app: Application = express();
const apiRoutes: Router = require('./routes/index.ts');
const cors: (options: CorsOptions) => (req: unknown, res: unknown, next: () => void) => void = require('cors');

const corsOptions: CorsOptions = {
    origin: [
        'http://localhost:4200',
        'http://localhost:3000',
        'http://localhost:54397'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);
app.get('/supplierA/hotels', (req, res) => {
    res.status(200).json(supplierAHotels);
});
app.get('/supplierB/hotels', (req, res) => {
    res.status(200).json(supplierBHotels);
});
app.get('/health', (req: HealthRequest, res: HealthResponse): void => {
    res.send('Server is healthy');
});
app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

