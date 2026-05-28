<template>
    <div class="home-page">
        <transition name="fade" appear>
            <div class="home-content">
                <section class="hero-section">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1 class="hero-title gold-text-glow">Mystic Tarot</h1>
                            <h1 class="hero-title gold-text-glow">探索靈魂的指引</h1>
                            <h1 class="hero-title gold-text-glow">開啟命運的光之旅程</h1>
                            <p class="hero-subtitle">在星与命运的交界，聆听内心的低语</p>
                            <!-- <p class="hero-description">
                                每一张塔罗牌，都是宇宙与你对话的信使。<br />
                                静心、凝神，让直觉引导你触摸未知的领域。
                            </p> -->
                        </div>

                        <div class="hero-actions">
                            <router-link to="/divination" class="btn-image-wrapper">
                                <img src="../assets/btn.png" alt="按钮背景" class="btn-image" />
                                <span class="btn-text">开启占卜之旅</span>
                            </router-link>
                        </div>
                    </div>

                    <div class="hero-cards">
                        <div class="tarot-card tarot-card--top">
                            <img src="../assets/fool.png" alt="塔罗牌" class="card-image" />
                        </div>
                        <div class="tarot-card tarot-card2 tarot-card--middle">
                            <img
                                src="../assets/star.png"
                                alt="塔罗牌"
                                class="card-image card-image2"
                            />
                        </div>
                        <div class="tarot-card tarot-card3 tarot-card--bottom">
                            <img
                                src="../assets/moon.png"
                                alt="塔罗牌"
                                class="card-image card-image2"
                            />
                        </div>
                    </div>
                </section>

                <!-- <footer class="home-footer">
                    <p class="footer-text">命运之轮，此刻开始转动</p>
                </footer> -->
            </div>
        </transition>
    </div>
</template>

<script setup></script>

<style scoped>
.home-page {
    height: 100vh;
    padding-top: 60px;
    padding-bottom: 40px;
    position: relative;
    overflow: hidden;
}

.home-content {
    /* max-width: 960px; */
    margin: 0 200px;
    padding: 0 24px;
    position: relative;
    z-index: 1;
    height: 100%;
}

.hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 80px 0 64px;
    position: relative;
    border-radius: var(--radius-lg);
    margin-bottom: 24px;
    height: 100%;
    /* min-height: 500px; */
}

.hero-content {
    flex: 1;
    max-width: 500px;
    position: relative;
    z-index: 2;
}

.hero-text {
    position: relative;
    z-index: 2;
}

.hero-cards {
    position: absolute;
    top: 40px;
    right: -20px;
    /* width: 500px;
    height: 450px; */
    width: 70%;
    height: 100%;
}

.tarot-card {
    position: absolute;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.5s ease;
    animation: cardFloat 4s ease-in-out infinite;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

.tarot-card::after {
    content: '';
    position: absolute;
    inset: -24px;
    border-radius: 20px;
    background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
}

.tarot-card:hover::after {
    opacity: 1;
}

.tarot-card:hover {
    z-index: 10;
    animation-play-state: paused;
}

.tarot-card--top:hover {
    transform: rotate(15deg) scale(1.08) translateY(-6px);
    filter: drop-shadow(0 15px 40px rgba(201, 168, 76, 0.3));
}

.tarot-card--middle:hover {
    transform: rotate(-20deg) scale(1.08) translateY(-6px);
    filter: drop-shadow(0 15px 40px rgba(201, 168, 76, 0.3));
}

.tarot-card--bottom:hover {
    transform: rotate(18deg) scale(1.08) translateY(-6px);
    filter: drop-shadow(0 15px 40px rgba(201, 168, 76, 0.3));
}

@keyframes cardFloat {
    0%, 100% {
        margin-top: 0;
    }
    50% {
        margin-top: -10px;
    }
}
.card-image {
    width: 200px;
    height: 300px;
    object-fit: contain;
    box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(201, 168, 76, 0.2),
        inset 0 0 30px rgba(201, 168, 76, 0.1);
    border-radius: 12px;
}
.card-image2 {
    width: 300px;
    height: 450px;
}
.tarot-card--top {
    top: 50px;
    right: 350px;
    transform: rotate(15deg);
    z-index: 1;
    animation-delay: 0s;
}

.tarot-card--middle {
    top: 300px;
    right: 450px;
    transform: rotate(-20deg);
    z-index: 3;
    animation-delay: -1.2s;
}

.tarot-card--bottom {
    top: 300px;
    right: 150px;
    transform: rotate(18deg);
    z-index: 2;
    animation-delay: -2.5s;
}

.hero-title {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-gold);
    margin-bottom: 12px;
    letter-spacing: 0.06em;
    text-shadow: 0 0 40px rgba(201, 168, 76, 0.3);
}

.hero-subtitle {
    font-family: var(--font-display);
    font-size: 1.15rem;
    color: var(--color-purple-light);
    margin-bottom: 20px;
    letter-spacing: 0.12em;
    font-style: italic;
}

.hero-description {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
    max-width: 500px;
    margin: 0 auto;
}

.hero-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 18px;
    margin-top: 40px;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
}

.hero-cta {
    padding: 15px 40px;
    font-size: 1.08rem;
    border-radius: var(--radius-lg);
}

.cta-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.btn-image-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.btn-image {
    display: block;
    width: 280px;
    height: 60px;
    object-fit: cover;
}

.btn-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: 1.08rem;
    font-weight: 600;
    color: var(--color-gold);
    letter-spacing: 0.1em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.home-footer {
    text-align: center;
    padding: 48px 0 20px;
}

.footer-text {
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    opacity: 0.7;
}

@media (max-width: 1024px) {
    .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 60px 0 40px;
    }

    .hero-content {
        max-width: 100%;
        margin-bottom: 40px;
    }

    .hero-cards {
        position: static;
        width: 100%;
        height: 320px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card-image {
        width: 120px;
        height: 180px;
    }

    .tarot-card--top {
        top: 20px;
        right: 30%;
        transform: rotate(-20deg);
    }

    .tarot-card--middle {
        top: 60px;
        right: 50%;
        transform: rotate(0deg);
    }

    .tarot-card--bottom {
        top: 100px;
        right: 70%;
        transform: rotate(20deg);
    }
}

@media (max-width: 767px) {
    .home-page {
        padding-top: 0;
        padding-bottom: 16px;
    }

    .hero-section {
        padding: 48px 0 40px;
        border-radius: var(--radius-md);
        min-height: auto;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-actions {
        margin-top: 32px;
    }

    .hero-cta {
        padding: 13px 32px;
        font-size: 1rem;
    }

    .home-content {
        padding: 0 12px;
    }

    .hero-cards {
        height: 280px;
    }

    .card-image {
        width: 100px;
        height: 160px;
    }

    .tarot-card--top {
        top: 5px;
        right: 30%;
    }

    .tarot-card--middle {
        top: 40px;
        right: 50%;
    }

    .tarot-card--bottom {
        top: 75px;
        right: 70%;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.7rem;
    }

    .hero-description {
        font-size: 0.88rem;
    }

    .hero-actions {
        flex-direction: column;
        gap: 12px;
    }

    .hero-cta {
        width: 100%;
        justify-content: center;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .hero-title {
        font-size: 2.4rem;
    }
}
</style>
