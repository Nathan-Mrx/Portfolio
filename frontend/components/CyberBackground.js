'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './CyberBackground.module.css';

export default function CyberBackground() {
    const pathname = usePathname();

    // Disable background on admin routes
    const isAdmin = pathname?.includes('/admin');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const lightX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const lightY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const dotsX = useTransform(mouseX, [0, 1000], [10, -10]);
    const dotsY = useTransform(mouseY, [0, 1000], [10, -10]);

    useEffect(() => {
        // Initial center position
        mouseX.set(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
        mouseY.set(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (isAdmin) return null;

    return (
        <div className={styles.cyberBackground}>
            {/* Background Dots with Parallax */}
            <motion.div
                className={styles.backgroundDots}
                style={{ x: dotsX, y: dotsY }}
            />

            {/* Interactive Spotlight */}
            <motion.div
                className={styles.spotlight}
                style={{
                    '--x': useTransform(lightX, (val) => `${val}px`),
                    '--y': useTransform(lightY, (val) => `${val}px`)
                }}
            />
        </div>
    );
}
