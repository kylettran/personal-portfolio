"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/util/mouse";

interface ParticlesProps {
	className?: string;
	quantity?: number;
	staticity?: number;
	ease?: number;
	refresh?: boolean;
}

export default function Particles({
	className = "",
	quantity = 30,
	staticity = 50,
	ease = 50,
	refresh = false,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const circles = useRef<any[]>([]);
	const shootingStars = useRef<any[]>([]);
	const mousePosition = useMousePosition();
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
	const nextShotAt = useRef<number>(Date.now() + 6000);

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}
		initCanvas();
		animate();
		window.addEventListener("resize", initCanvas);

		return () => {
			window.removeEventListener("resize", initCanvas);
		};
	}, []);

	useEffect(() => {
		onMouseMove();
	}, [mousePosition.x, mousePosition.y]);

	useEffect(() => {
		initCanvas();
	}, [refresh]);

	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
	};

	const onMouseMove = () => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const { w, h } = canvasSize.current;
			const x = mousePosition.x - rect.left - w / 2;
			const y = mousePosition.y - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.current.x = x;
				mouse.current.y = y;
			}
		}
	};

	type Circle = {
		x: number;
		y: number;
		translateX: number;
		translateY: number;
		size: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
	};

	type ShootingStar = {
		length: number;
		createdAt: number;
		durationMs: number;
		alpha: number;
		startX: number;
		startY: number;
		ctrlX: number;
		ctrlY: number;
		endX: number;
		endY: number;
	};

	const resizeCanvas = () => {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			circles.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
	};

	const circleParams = (): Circle => {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);
		const translateX = 0;
		const translateY = 0;
		const size = Math.random() * 1.8 + 0.6;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.25).toFixed(2));
		const dx = (Math.random() - 0.5) * 0.2;
		const dy = (Math.random() - 0.5) * 0.2;
		const magnetism = 0.1 + Math.random() * 4;
		return {
			x,
			y,
			translateX,
			translateY,
			size,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
		};
	};

	const drawCircle = (circle: Circle, update = false) => {
		if (context.current) {
			const { x, y, translateX, translateY, size, alpha } = circle;
			context.current.translate(translateX, translateY);
			context.current.beginPath();
			context.current.arc(x, y, size, 0, 2 * Math.PI);
			context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			context.current.fill();
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.current.push(circle);
			}
		}
	};

	const clearContext = () => {
		if (context.current) {
			context.current.clearRect(
				0,
				0,
				canvasSize.current.w,
				canvasSize.current.h,
			);
		}
	};

	const drawParticles = () => {
		clearContext();
		const particleCount = quantity;
		for (let i = 0; i < particleCount; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped =
			((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	const randomBetween = (min: number, max: number) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const getPathPointAndTangent = (star: ShootingStar, t: number) => {
		const { startX, startY, ctrlX, ctrlY, endX, endY } = star;
		const oneMinus = 1 - t;
		const x =
			oneMinus * oneMinus * startX +
			2 * oneMinus * t * ctrlX +
			t * t * endX;
		const y =
			oneMinus * oneMinus * startY +
			2 * oneMinus * t * ctrlY +
			t * t * endY;
		const dx =
			2 * oneMinus * (ctrlX - startX) + 2 * t * (endX - ctrlX);
		const dy =
			2 * oneMinus * (ctrlY - startY) + 2 * t * (endY - ctrlY);
		const len = Math.hypot(dx, dy) || 1;
		return { x, y, tx: dx / len, ty: dy / len };
	};

	const createShootingStar = (): ShootingStar => {
		const { w, h } = canvasSize.current;
		const margin = Math.max(w, h) * 0.12 + 60;
		const edge = Math.floor(Math.random() * 4);
		let startX = 0;
		let startY = 0;
		let endX = 0;
		let endY = 0;

		if (edge === 0) {
			startX = -margin;
			startY = Math.random() * h;
			endX = w + margin;
			endY = Math.random() * h;
		} else if (edge === 1) {
			startX = w + margin;
			startY = Math.random() * h;
			endX = -margin;
			endY = Math.random() * h;
		} else if (edge === 2) {
			startX = Math.random() * w;
			startY = -margin;
			endX = Math.random() * w;
			endY = h + margin;
		} else {
			startX = Math.random() * w;
			startY = h + margin;
			endX = Math.random() * w;
			endY = -margin;
		}

		const midX = (startX + endX) / 2;
		const midY = (startY + endY) / 2;
		const nx = -(endY - startY);
		const ny = endX - startX;
		const nLen = Math.hypot(nx, ny) || 1;
		const curve = (Math.random() * 0.04 + 0.03) * Math.hypot(w, h);
		const direction = Math.random() > 0.5 ? 1 : -1;
		const ctrlX = midX + (nx / nLen) * curve * direction;
		const ctrlY = midY + (ny / nLen) * curve * direction;

		const durationMs = 3000;
		const now = Date.now();
		return {
			length: Math.random() * 280 + 420,
			createdAt: now,
			durationMs,
			alpha: Math.random() * 0.35 + 0.55,
			startX,
			startY,
			ctrlX,
			ctrlY,
			endX,
			endY,
		};
	};

	const drawShootingStars = () => {
		if (!context.current) return;
		const now = Date.now();
		if (now >= nextShotAt.current) {
			shootingStars.current.push(createShootingStar());
			nextShotAt.current = now + 3000;
		}

		shootingStars.current = shootingStars.current.filter(
			(star) => now - star.createdAt <= star.durationMs,
		);
		shootingStars.current.forEach((star) => {
			const t = Math.min(
				1,
				Math.max(0, (now - star.createdAt) / star.durationMs),
			);
			const { x, y, tx, ty } = getPathPointAndTangent(star, t);
			const tailX = x - tx * star.length;
			const tailY = y - ty * star.length;
			const gradient = context.current!.createLinearGradient(
				x,
				y,
				tailX,
				tailY,
			);
			gradient.addColorStop(0, `rgba(255, 200, 90, ${star.alpha})`);
			gradient.addColorStop(1, "rgba(255, 200, 90, 0)");

			context.current!.beginPath();
			context.current!.moveTo(x, y);
			context.current!.lineTo(tailX, tailY);
			context.current!.strokeStyle = gradient;
			context.current!.lineWidth = 2.5;
			context.current!.lineCap = "round";
			context.current!.setTransform(dpr, 0, 0, dpr, 0, 0);
			context.current!.stroke();

			context.current!.beginPath();
			context.current!.arc(x, y, 2.8, 0, 2 * Math.PI);
			context.current!.fillStyle = `rgba(255, 230, 160, ${Math.min(
				1,
				star.alpha + 0.25,
			)})`;
			context.current!.shadowBlur = 12;
			context.current!.shadowColor = "rgba(255, 200, 90, 0.6)";
			context.current!.fill();
			context.current!.shadowBlur = 0;
		});
	};

	const animate = () => {
		clearContext();
		circles.current.forEach((circle: Circle, i: number) => {
			// Handle the alpha value
			const edge = [
				circle.x + circle.translateX - circle.size, // distance from left edge
				canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
				circle.y + circle.translateY - circle.size, // distance from top edge
				canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			);
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}
			circle.x += circle.dx;
			circle.y += circle.dy;
			circle.translateX +=
				(mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
				ease;
			circle.translateY +=
				(mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
				ease;
			// circle gets out of the canvas
			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				// remove the circle from the array
				circles.current.splice(i, 1);
				// create a new circle
				const newCircle = circleParams();
				drawCircle(newCircle);
				// update the circle position
			} else {
				drawCircle(
					{
						...circle,
						x: circle.x,
						y: circle.y,
						translateX: circle.translateX,
						translateY: circle.translateY,
						alpha: circle.alpha,
					},
					true,
				);
			}
		});
		drawShootingStars();
		window.requestAnimationFrame(animate);
	};

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
