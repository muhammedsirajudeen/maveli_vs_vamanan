import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { createCanvas, loadImage } from 'canvas';

const SECRET = process.env.JWT_SECRET || '@MuhammedSirajudeen123456';

export async function GET(req: NextRequest) {
    try {
        // 1. Generate a unique JWT token
        const tokenPayload = {
            id: Math.random().toString(36).substring(2, 12),
            ts: Date.now(),
        };
        const token = jwt.sign(tokenPayload, SECRET, { expiresIn: '7d' });

        // 2. Load the base image from /public
        const img = await loadImage(`https://onam.ciltriq.com/winner.png`);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        // 3. Draw original image
        ctx.drawImage(img, 0, 0);

        // 4. Style for watermark
        const fontSize = Math.floor(img.width * 0.02); // dynamic font size (~2% of width)
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        // 5. Wrap and draw text (white fill + black stroke)
        const maxWidth = img.width * 0.8; // max width before wrapping
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

        // 6. Convert buffer to Uint8Array
        const buffer = canvas.toBuffer('image/png');
        const uint8Array = new Uint8Array(buffer);

        // 7. Send response
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
