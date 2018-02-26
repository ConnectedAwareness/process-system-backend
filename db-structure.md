#DB-Structure

This File Contains all sql-requests we used to create the mysql-database
To get the create query from phpmyadmin you have to type the followin query
into the sql tab:
```SHOW CREATE TABLE user```

##Requests

User-Table

```
CREATE TABLE `user` (
 `id` bigint(20) NOT NULL AUTO_INCREMENT,
 `email` varchar(40) NOT NULL,
 `name` varchar(30) DEFAULT NULL,
 `password` varchar(30) NOT NULL,
 `token` varchar(100) DEFAULT NULL,
 `token_date` bigint(20) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```