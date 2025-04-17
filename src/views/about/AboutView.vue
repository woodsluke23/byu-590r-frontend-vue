<template>
    <div class="about-page">
        <div class="about-header">
            <h1>About Chicken Tracker</h1>
            <p>
                Your personal guide to discovering and remembering the best chicken restaurants
                around.
            </p>
        </div>

        <div class="about-content">
            <section class="about-section">
                <h2>Our Story</h2>
                <p>
                    Chicken Tracker was born from a passion for finding the perfect chicken dish.
                    Whether it's crispy fried chicken, spicy wings, or a rotisserie masterpiece, we
                    believe that great chicken deserves to be celebrated and shared.
                </p>
                <p>
                    This platform allows chicken enthusiasts to keep track of their favorite
                    restaurants, rate their experiences, and never forget where they had that
                    amazing chicken sandwich.
                </p>
            </section>

            <section class="about-section">
                <h2>Features</h2>
                <p>
                    Discover what makes Chicken Tracker the ultimate companion for your chicken
                    culinary adventures:
                </p>

                <div class="features">
                    <div class="feature-card">
                        <div class="chicken-icon">🍗</div>
                        <h3>Restaurant Tracking</h3>
                        <p>
                            Save and organize all your favorite chicken spots in one convenient
                            location.
                        </p>
                    </div>

                    <div class="feature-card">
                        <div class="chicken-icon">⭐</div>
                        <h3>Rating System</h3>
                        <p>
                            Rate restaurants based on taste, service, and value to remember your
                            experiences.
                        </p>
                    </div>

                    <div class="feature-card">
                        <div class="chicken-icon">📝</div>
                        <h3>Personal Notes</h3>
                        <p>
                            Add custom notes about special dishes, secret menu items, or anything
                            else worth remembering.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AboutView',
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/ui.scss';

// Import the SCSS styling from your about.scss file
// Or you can place the SCSS directly here
</style>
<style src="./AboutView.scss" />
