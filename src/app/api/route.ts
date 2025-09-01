import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { createCanvas, loadImage, registerFont } from 'canvas';

const SECRET = process.env.JWT_SECRET || '@MuhammedSirajudeen123456';

import { promises as fs } from 'fs';
import path from 'path';

async function loadFontFromUrl(url: string, family: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load font: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fontPath = path.join('/tmp', `${family}.otf`);
    await fs.writeFile(fontPath, buffer); // Save font to tmp
    registerFont(fontPath, { family });   // Register using path
}



export async function GET(req: NextRequest) {
    try {
        // 🔹 1. Load custom font dynamically
        await loadFontFromUrl(
            'https://onam.ciltriq.com/font.otf', // 🔥 Your font URL
            'CustomFont'
        );

        // 🔹 2. Generate token
        const tokenPayload = {
            id: Math.random().toString(36).substring(2, 12),
            ts: Date.now(),
        };
        const token = jwt.sign(tokenPayload, SECRET, { expiresIn: '7d' });

        // 🔹 3. Load the base image
        const img = await loadImage(`https://onam.ciltriq.com/winner.png`);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        // 🔹 4. Use custom font
        const fontSize = Math.floor(img.width * 0.02);
        ctx.font = `bold ${fontSize}px CustomFont`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        const maxWidth = img.width * 0.8;
        const lineHeight = fontSize * 1.2;

        function wrapText(text: string, x: number, y: number) {
            const words = text.split('');
            let line = '';
            const lines: string[] = [];

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i];
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && i > 0) {
                    lines.push(line);
                    line = words[i];
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            for (let i = 0; i < lines.length; i++) {
                const ly = y - (lines.length - 1 - i) * lineHeight;
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'black';
                ctx.strokeText(lines[i], x, ly);
                ctx.fillStyle = 'white';
                ctx.fillText(lines[i], x, ly);
            }
        }

        wrapText(token, img.width - 20, img.height - 20);

        const buffer = canvas.toBuffer('image/png');
        const uint8Array = new Uint8Array(buffer);

        return new Response(uint8Array, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename=winner.png',
            },
        });
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: 'Image generation failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
