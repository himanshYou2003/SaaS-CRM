FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libssl-dev \
    pkg-config \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo mbstring exif pcntl bcmath gd

# Install MongoDB PHP extension (from PECL)
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Install Redis PHP extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Create system user for running Composer / Artisan
RUN useradd -G www-data,root -u 1000 -d /home/deploy deploy
RUN mkdir -p /home/deploy/.composer && chown -R deploy:deploy /home/deploy

# Set working directory
WORKDIR /var/www/html

USER deploy
