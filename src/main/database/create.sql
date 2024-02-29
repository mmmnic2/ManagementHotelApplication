USE
carrental;
-- role = 0 => admin, role = 1 => user
CREATE TABLE `users`
(
    `id`        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `email`     VARCHAR(60)  NOT NULL,
    `name`      VARCHAR(225) NOT NULL,
    `password`  VARCHAR(45)  NOT NULL,
    `user_role` INT          NOT NULL,
    PRIMARY KEY (`id`)
);
CREATE TABLE `book_car`
(
    `id`        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `status`    INT       NOT NULL,
    `days`      FLOAT     NOT NULL,
    `from_date` TIMESTAMP NOT NULL,
    `price` DOUBLE NOT NULL,
    `to_date`   TIMESTAMP NOT NULL,
    `car_id`    BIGINT(20) NOT NULL,
    `user_id`   BIGINT(20) NOT NULL,
    PRIMARY KEY (`id`)
);
CREATE TABLE `cars`
(
    `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
    `brand`        VARCHAR(225) NOT NULL,
    `color`        VARCHAR(60)  NOT NULL,
    `description`  VARCHAR(255) NULL,
    `img`          BLOB         NOT NULL,
    `name`         VARCHAR(225) NOT NULL,
    `price` DOUBLE NOT NULL,
    `transmission` VARCHAR(225) NULL,
    `type`         VARCHAR(225) NULL,
    `year`         TIMESTAMP NULL,
    PRIMARY KEY (`id`)
);
alter table book_car
    add constraint fk_car foreign key (car_id) references cars (id);
alter table book_car
    add constraint fk_user foreign key (user_id) references users (id);
