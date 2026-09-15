FROM php:8.2-apache
RUN apt-get update && apt-get install -y gnupg && pecl install sqlsrv pdo_sqlsrv && docker-php-ext-enable sqlsrv pdo_sqlsrv