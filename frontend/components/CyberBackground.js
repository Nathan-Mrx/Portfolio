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

    const lightX = useSpring(mouseX, { stiffness: 150, damping: 30 });
    const lightY = useSpring(mouseY, { stiffness: 150, damping: 30 });

    const dotsX = useTransform(mouseX, [0, 1000], [10, -10]);
    const dotsY = useTransform(mouseY, [0, 1000], [10, -10]);

    const spotlightX = useTransform(lightX, (val) => `${val}px`);
    const spotlightY = useTransform(lightY, (val) => `${val}px`);

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

    // Use conditional rendering ONLY in the return, not early return
    return (
        <div className={styles.cyberBackground} style={{ display: isAdmin ? 'none' : 'block' }}>
            {/* Background Dots with Parallax */}
            <motion.div
                className={styles.backgroundDots}
                style={{ x: dotsX, y: dotsY }}
            />

            {/* Interactive Spotlight */}
            <motion.div
                className={styles.spotlight}
                style={{
                    '--x': spotlightX,
                    '--y': spotlightY
                }}
            />

            {/* Film Grain (Dithering) */}
            <div className={styles.grain} />
        </div>
    );
}
