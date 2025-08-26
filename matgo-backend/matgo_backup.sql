/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: matgo_db
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Admins` VALUES
(1,'System Admin','admin@matgo.co.ke','$2b$12$CIMxOHilo9bpwG9bqhcr7uThuvAxAvcfwMRROmZLQcm3oNN1l9nyy','2025-08-24 17:08:30','2025-08-24 17:08:30');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Bookings`
--

DROP TABLE IF EXISTS `Bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `passengerId` int(11) DEFAULT NULL,
  `tripId` int(11) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `seats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`seats`)),
  `totalPrice` decimal(10,2) DEFAULT NULL,
  `passengers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`passengers`)),
  `paymentMethod` varchar(255) DEFAULT NULL,
  `sacco` varchar(255) DEFAULT NULL,
  `tripType` varchar(255) DEFAULT NULL,
  `seatsBooked` int(11) DEFAULT 1,
  `paid` tinyint(1) DEFAULT 0,
  `status` varchar(255) DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bookings`
--

LOCK TABLES `Bookings` WRITE;
/*!40000 ALTER TABLE `Bookings` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Bookings` VALUES
(1,2,NULL,'nairobi-mombasa','2025-08-01','18:00','[\"E1\",\"E2\"]',4400.00,'[{\"seatId\":\"E1\",\"name\":\"Laurine\"},{\"seatId\":\"E2\",\"name\":\"Allan jr \"}]','M-Pesa (Simulated)','Mombasa Raha','Long Distance',1,0,'confirmed','2025-07-31 15:52:52','2025-07-31 15:52:52'),
(2,1,NULL,'nairobi-mombasa','2025-08-01','18:00','[\"11B\"]',2200.00,'[{\"seatId\":\"11B\",\"name\":\"ggg\"}]','M-Pesa','Mombasa Raha','Long Distance',1,0,'confirmed','2025-07-31 19:36:47','2025-07-31 19:36:47'),
(3,1,NULL,'nairobi-kisumu','2025-08-27','16:00','[\"E3\",\"E2\"]',3600.00,'[{\"seatId\":\"E3\",\"name\":\"Allan\"},{\"seatId\":\"E2\",\"name\":\"Ariam\"}]','M-Pesa','Kisumu Express','Long Distance',1,0,'confirmed','2025-08-25 11:35:02','2025-08-25 11:35:02');
/*!40000 ALTER TABLE `Bookings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Conductors`
--

DROP TABLE IF EXISTS `Conductors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Conductors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nationalId` varchar(255) NOT NULL,
  `sacco` varchar(255) NOT NULL,
  `busIdentifier` varchar(255) NOT NULL,
  `busType` varchar(255) DEFAULT 'Matatu',
  `avatar` varchar(255) DEFAULT NULL,
  `busPic` varchar(255) DEFAULT NULL,
  `nationalIdImage` varchar(255) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  KEY `userId` (`userId`),
  CONSTRAINT `Conductors_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Conductors`
--

LOCK TABLES `Conductors` WRITE;
/*!40000 ALTER TABLE `Conductors` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Conductors` VALUES
(1,NULL,'Theo','theo.conductor@matgo.co.ke','0744000001','$2b$12$s3v7YgQWJPrHHK6de9lEjeXWy4JA.GaaL0jApHg69Kgmx2unpCqM.','ID1111','NTVRS','X-Rated','Matatu','theo.jpg','x-rated.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(2,NULL,'Deni','deni.conductor@matgo.co.ke','0744000002','$2b$12$A5hJzviwJHf2v0nCMp5jjOKeDBKjjrIW2ZEPPcjy/JJMSTyvpAas2','ID1112','NTVRS','Phenomenal','Matatu','deni.jpg','phenomenal.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(3,NULL,'Ivor','ivor.conductor@matgo.co.ke','0744000003','$2b$12$KsHmzM12MzNHj6AO/OJbkufaCP3RWS4uVt.47bKLXglzAdHuWppGu','ID1113','NTVRS','CyberPunk','Matatu','ivor.jpg','cyberpunk.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(4,NULL,'Matt','matt.conductor@matgo.co.ke','0744000004','$2b$12$1dZoIhD2edrlXPawH77BXeYaIcM4mX5PqXkwhHszNsOBrjDBodflm','ID1114','NTVRS','Harukaze','Matatu','matt.jpg','harukaze.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(5,NULL,'Tman','tman.conductor@matgo.co.ke','0744000005','$2b$12$.60vDOtfdb23ZTtZEmZdM.TT.WsxDZJxgGO8u76SyJnXZUkLfsf6G','ID1115','NTVRS','Ikigai','Matatu','tman.jpg','ikigai.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(6,NULL,'Ellie','ellie.conductor@matgo.co.ke','0744000006','$2b$12$T0J/w/Oh0E9qgP.ToKwivOYKznobSkgp8lt4p0Fl240HKLMn3Qe6y','ID1116','NTVRS','Mellows','Matatu','ellie.jpg','mellows.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(7,NULL,'Renee','renee.conductor@matgo.co.ke','0744000007','$2b$12$gzo1I1RV9XtzC59WgfG9C.ojq5uNSIAb1.tQ9Oj7BHrwlbFYG./WS','ID1117','NTVRS','Stormzy','Matatu','renee.jpg','stormzy.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(8,NULL,'Nachi','nachi.conductor@matgo.co.ke','0744000008','$2b$12$Bt.qFwyZ7I8k6EOZ3CMvwuFLVz5SEE.NIYy1WwHlwAZNp/2kQc.Ny','ID1118','NTVRS','Monalisa','Matatu','nachi.jpg','monalisa.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(9,NULL,'JVB','jvb.conductor@matgo.co.ke','0744000009','$2b$12$XZZXLw5SJkAy/RxfIEg4keIdHPsAKSmrHXeIUGuLVh8gI0ADOCjAa','ID1119','NTVRS','Spice','Matatu','jvb.jpg','spice.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(10,NULL,'Slim','slim.conductor@matgo.co.ke','0744000010','$2b$12$tTRVLkkWTu9NgNMtSxYxoedsV.M/o0zFQm/00rhwsUh1p/jMrFz5e','ID1120','NTVRS','Spurs','Matatu','slim.jpg','spurs.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(11,NULL,'Maverick','maverick.conductor@matgo.co.ke','0744000011','$2b$12$cSYXp8DKyscD7WYMb/XeO./EBNy7Ixp8t.F7ZD/Y/eQVEyoyDcONS','ID1121','NTVRS','Explicit','Matatu','maverick.jpg','explicit.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(12,NULL,'Drakoo','drakoo.conductor@matgo.co.ke','0744000012','$2b$12$FYxL4wZ3sCbuVd2.J2.Jm.H.a8j1PL5qj3m25TdHkOj.d1WAIw.dq','ID1122','NTVRS','SCrilla','Matatu','drakoo.jpg','scrilla.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(13,NULL,'Ben','ben.conductor@matgo.co.ke','0744000013','$2b$12$IhecsMOsJr.00L6DF7Zcue09PoMVbeR0rc5ZkHK/oM9gsu3tcVvYi','ID1123','Expresso','Baba Yaga','Matatu','ben.jpg','babayaga.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(14,NULL,'Kim','kim.conductor@matgo.co.ke','0744000014','$2b$12$rT3QyOVCDGJ03OVVRCBzNetEp73E2QdFdwmPzi6MKdwrk78mz46WC','ID1124','Expresso','Moxie','Matatu','kim.jpg','moxie.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(15,NULL,'Mwari','mwari.conductor@matgo.co.ke','0744000015','$2b$12$rKzK5lILV2dxc0auh1Br0eM9PXAHcevV9l5JHFy3gsMX0x01ZX1jK','ID1125','Expresso','Ferari','Matatu','mwari.jpg','ferari.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(16,NULL,'Mwas','mwas.conductor@matgo.co.ke','0744000016','$2b$12$k93M8Gl4mCIy19sy1s0CI.BlpPx4SiCR9cxjaIY4hpRelICCtpfoG','ID1126','Expresso','Detroit','Matatu','mwas.jpg','detroit.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(17,NULL,'Davi','davi.conductor@matgo.co.ke','0744000017','$2b$12$FsRxiuSz7V2F29dJEHnZce8en1qpzn1.oyt0yyNfHidBB4FxHjRKG','ID1127','Expresso','Gamer','Matatu','davi.jpg','gamer.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(18,NULL,'Smith','smith.conductor@matgo.co.ke','0744000018','$2b$12$y8b.5Vke8jsmHRAJ9Cb2O.BPxlLFszEfcArD7NqoVDpKa22QbljFa','ID1128','Expresso','Funka Delica','Matatu','smith.jpg','funkadelica.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(19,NULL,'Hypr','hypr.conductor@matgo.co.ke','0744000019','$2b$12$NTiCcqcDB4alZ88mXl8qKuW4kxXCZ3XfvNu2jf9T47llMFUA8nCYS','ID1129','Expresso','Malkia','Matatu','hypr.jpg','malkia.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(20,NULL,'Capi','capi.conductor@matgo.co.ke','0744000020','$2b$12$cvjU6JAIFlIzq1aTBHDxo.aP.JhaAgWfO/3No6Aoz3aJziww3Y8f6','ID1130','Expresso','Jabari','Matatu','capi.jpg','jabari.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(21,NULL,'Moses','moses.conductor@matgo.co.ke','0744000021','$2b$12$szj8toFuSZMVSI8w3p5hcu063ubuxM7Fhe3C84X3ste7nASwmsR26','ID1131','Embasava','Brawlout','Matatu','moses.jpg','brawlout.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(22,NULL,'Qodo','qodo.conductor@matgo.co.ke','0744000022','$2b$12$/1wq00VaxqrS5.OJmaXVwejmWQy0jEKQW/UZoAc3PnA8M2rAV1quW','ID1132','Embasava','MoneyFest','Matatu','qodo.jpg','moneyfest.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(23,NULL,'Gemmi','gemmi.conductor@matgo.co.ke','0744000023','$2b$12$2LOqQ1pkyrDR46FV2gNDs.zMdJ6jE/ghn5z6zLT2yc.BEilaan6by','ID1133','Embasava','Heartless','Matatu','gemmi.jpg','heartless.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(24,NULL,'Kilo','kilo.conductor@matgo.co.ke','0744000024','$2b$12$rHL9jlKvyd0ChnpkDuqlBOhLazhTlQEdobTnysBtogoxTgpRerVFO','ID1134','Embasava','Matrix','Matatu','kilo.jpg','matrix.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(25,NULL,'Mkuu','mkuu.conductor@matgo.co.ke','0744000025','$2b$12$R2m/osrjPs/o.MQYYNL2iuH.Y.axOPtoxw5qzIPbAaM7qSbIzf1wq','ID1135','Embasava','Mood','Matatu','mkuu.jpg','mood.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(26,NULL,'Jade','jade.conductor@matgo.co.ke','0744000026','$2b$12$dq9/Ki81h4sxcFV4Sa2aMesOuxAOAimsoufSytu7yXxYDlB0JBIAO','ID1136','Embasava','Genesis','Matatu','jade.jpg','genesis.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(27,NULL,'Resto','resto.conductor@matgo.co.ke','0744000027','$2b$12$fHCfxknFDAcPyEN9sdasqeLvjaIfo0rCbp7O53A8eH.KUy9BhkBrW','ID1137','Embasava','Restoration','Matatu','resto.jpg','restoration.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(28,NULL,'John','johnsm.conductor@matgo.co.ke','0744000028','$2b$12$XERXIgzCsHYpImQ3hzIexekC1oqlK2o3lV52wraQmAXTHHU7lMlcS','ID1138','Supermetro','1456','Matatu','johnsm.jpg','1456.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(29,NULL,'Kelvin','kelvinsm.conductor@matgo.co.ke','0744000029','$2b$12$ZLdYJMNhE4XZKNDaTjKRB.u0k89uuJmgCazVJ7iQxnLMhqeIlfSIC','ID1139','Supermetro','3743','Matatu','kelvinsm.jpg','3743.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(30,NULL,'Steve','stevesm.conductor@matgo.co.ke','0744000030','$2b$12$L0GQymuci7EtHTXzLQd8le9O66uKveR2vHMvhBBJohJyvG7g/6JUy','ID1140','Supermetro','8643','Matatu','stevesm.jpg','8643.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(31,NULL,'Ryan','ryansm.conductor@matgo.co.ke','0744000031','$2b$12$KTIrUcyu6JzmeIN2juaGHeHleHbztDynYLmY9CLvmp1ue0dLX82D2','ID1141','Supermetro','3737','Matatu','ryansm.jpg','3737.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(32,NULL,'Maina','mainasm.conductor@matgo.co.ke','0744000032','$2b$12$RnTj1PkR1JSDYuS6HC3T9OHC3F0SyocuKtjrTLTzvRuVRqyPp0be6','ID1142','Supermetro','1234','Matatu','mainasm.jpg','1234.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(33,NULL,'James','jamessm.conductor@matgo.co.ke','0744000033','$2b$12$JCHh7YCXqs8zel81ev0LPejf2714MMGDMUlhbVf1OKjuNw4swZ0uW','ID1143','Supermetro','0001','Matatu','jamessm.jpg','0001.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(34,NULL,'Kelvin','kelvinsm2.conductor@matgo.co.ke','0744000034','$2b$12$7RkuTMvsAYz4yVqdFEXsX.ffjyOLGkSE/c.xdE7YHnctQnYvtHGNi','ID1144','Supermetro','19373','Matatu','kelvinsm2.jpg','19373.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(35,NULL,'Charles','charlessm.conductor@matgo.co.ke','0744000035','$2b$12$dah9tD9eSAA2n.0dUHFfW.g2UJRZM446mzXwOKaoPWQmgHaZADsiK','ID1145','Supermetro','12349','Matatu','charlessm.jpg','12349.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(36,NULL,'John','johnsm2.conductor@matgo.co.ke','0744000036','$2b$12$Y39PasjFekbCNnnUtf1.keIywcBM3mFOeWcCraGGr8Xe5OFTW/frC','ID1146','Supermetro','23456','Matatu','johnsm2.jpg','23456.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(37,NULL,'Maina','mainasm2.conductor@matgo.co.ke','0744000037','$2b$12$D05qPdH89n2JKANm/NmCs.EDhf6EnQz65o1dN7cz/L5TCNMpjSEWK','ID1147','Supermetro','32456','Matatu','mainasm2.jpg','32456.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54'),
(38,NULL,'Evans','evanssm.conductor@matgo.co.ke','0744000038','$2b$12$Lp7NCqLYdcIH8x6S6lGveO.YAvTMCgKgXn8iwDwn6MVmITV6shD7e','ID1148','Supermetro','78902','Matatu','evanssm.jpg','78902.jpg',NULL,1,'2025-07-31 20:57:54','2025-07-31 20:57:54');
/*!40000 ALTER TABLE `Conductors` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Drivers`
--

DROP TABLE IF EXISTS `Drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Drivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `licenseNumber` varchar(255) NOT NULL,
  `sacco` varchar(255) NOT NULL,
  `busIdentifier` varchar(255) NOT NULL,
  `busType` varchar(255) DEFAULT 'Matatu',
  `avatar` varchar(255) DEFAULT NULL,
  `busPic` varchar(255) DEFAULT NULL,
  `licenseDoc` varchar(255) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  KEY `userId` (`userId`),
  CONSTRAINT `Drivers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Drivers`
--

LOCK TABLES `Drivers` WRITE;
/*!40000 ALTER TABLE `Drivers` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Drivers` VALUES
(1,NULL,'Ochila','ochila.driver@matgo.co.ke','0733000001','$2b$12$dlDpW/NnYMrrKUn3qEz4hOxkcIPDhrK60FEMJV22hBIDBoL0NLZ2S','DL1111','NTVRS','X-Rated','Matatu','ochila.jpg','x-rated.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(2,NULL,'Dan','dan.driver@matgo.co.ke','0733000002','$2b$12$5m.3cJNaTFQzaXeN2dh4VeQRbao7CA9/YMprg7tbiELltQ10NFPZ2','DL1112','NTVRS','Phenomenal','Matatu','dan.jpg','phenomenal.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(3,NULL,'Steven','steven.driver@matgo.co.ke','0733000003','$2b$12$I2N/o/TyLEyEdcX/0uUjQu3BPUMazPadO9D2PURfLalvp0ecDAAx2','DL1113','NTVRS','CyberPunk','Matatu','steven.jpg','cyberpunk.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(4,NULL,'Brian','brian.driver@matgo.co.ke','0733000004','$2b$12$qJp1vXPwHXvwPCN9Pg2RCujsAOoPuOB7MIn0dM.Jxr2/ZbdfmV1GW','DL1114','NTVRS','Harukaze','Matatu','brian.jpg','harukaze.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(5,NULL,'Otieno','otieno.driver@matgo.co.ke','0733000005','$2b$12$Dstno8gBSaT0oOLlKPzB0OQ3VA195y/wBQAdeDr5YtlJ0CMhAbB6.','DL1115','NTVRS','Ikigai','Matatu','otieno.jpg','ikigai.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(6,NULL,'Dante','dante.driver@matgo.co.ke','0733000006','$2b$12$AhwJAwA8WvBHigd0x0MsxeqTO3v24z87jCm7GKCVFK8cdOrpKAmku','DL1116','NTVRS','Mellows','Matatu','dante.jpg','mellows.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(7,NULL,'Alex','alex.driver@matgo.co.ke','0733000007','$2b$12$u/fwoVlHPWYIrOJj627ok.LolK7U7eP65nKuRUSbixHwnd9lt7c/W','DL1117','NTVRS','Stormzy','Matatu','alex.jpg','stormzy.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(8,NULL,'Dave','dave.driver@matgo.co.ke','0733000008','$2b$12$JRizrtIS5CmrDvZZPpE/gunOyHGxr6ZWcHY.tXsTk4C6aiBJptgoi','DL1118','NTVRS','Monalisa','Matatu','dave.jpg','monalisa.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(9,NULL,'Benjamin','benjamin.driver@matgo.co.ke','0733000009','$2b$12$okwsokcZJYyVo.LshRUYeuPh.KuKYZ/7HTf33NyhQC.7B7GAKAr6S','DL1119','NTVRS','Spice','Matatu','benjamin.jpg','spice.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(10,NULL,'Martin','martin.driver@matgo.co.ke','0733000010','$2b$12$XG2WH40Gn8cjQWcfl7JwCeVh.SDEVmhCxbAmI/FsL4JMEoYqgJCBO','DL1120','NTVRS','Spurs','Matatu','martin.jpg','spurs.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(11,NULL,'John','john.driver@matgo.co.ke','0733000011','$2b$12$7k836IAGzQvLy/l76rrqvOnAW1kAT4CEgtqAsQBwy.RI.lKYddDmm','DL1121','NTVRS','Explicit','Matatu','john.jpg','explicit.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(12,NULL,'Roy','roy.driver@matgo.co.ke','0733000012','$2b$12$A.W6KgkXHXuPU1ZBef/lpOjqNLEo1fguCZey6iD71u5w/e7uUZ9KK','DL1122','NTVRS','SCrilla','Matatu','roy.jpg','scrilla.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(13,NULL,'Allan','allan.driver@matgo.co.ke','0733000013','$2b$12$f6MBtnNuI7X7Po0JTJaRJ.R8PraWYGOEIVNWm.Lz1Izm1DI6WVKeq','DL1123','Expresso','Baba Yaga','Matatu','allan.jpg','babayaga.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(14,NULL,'Jeff','jeff.driver@matgo.co.ke','0733000014','$2b$12$eTm5VZ7uqCnnwR3HpLBGquLH8/WN1Ak1fSCDqqCqxFvPeXPhWr4yy','DL1124','Expresso','Moxie','Matatu','jeff.jpg','moxie.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(15,NULL,'Moses','moses.driver@matgo.co.ke','0733000015','$2b$12$XAYRr5nWMn9he4/VD08N0eIQ27ORlaXC6XsMYJQsqcsSBnoIz4.7m','DL1125','Expresso','Ferari','Matatu','moses.jpg','ferari.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(16,NULL,'Andrew','andrew.driver@matgo.co.ke','0733000016','$2b$12$a3yMngk2SG84jc.vNBMvB.uw8C5TlJlmgh5L4PJTG97v8HM56njvS','DL1126','Expresso','Detroit','Matatu','andrew.jpg','detroit.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(17,NULL,'Dante','dantek.driver@matgo.co.ke','0733000017','$2b$12$YoHuW/3MyPMsXDiaobgy9e0ZOmxfswHudj4vXObrzPG09N40THs7O','DL1127','Expresso','Gamer','Matatu','dantek.jpg','gamer.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(18,NULL,'Kibe','kibe.driver@matgo.co.ke','0733000018','$2b$12$NiwmnLxNaMgTwejsiBb6WuSiK/lTcGvrCTKply2p.ZeM6TmSk2AoO','DL1128','Expresso','Funka Delica','Matatu','kibe.jpg','funkadelica.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(19,NULL,'Abra','abra.driver@matgo.co.ke','0733000019','$2b$12$H8VeulS/LnSP5HFdzop6HuYJJY.ZgQBG64jFYRe3.RLyB0pZs7P9u','DL1129','Expresso','Malkia','Matatu','abra.jpg','malkia.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(20,NULL,'Kim','kimk.driver@matgo.co.ke','0733000020','$2b$12$4W123lUUJ/s13PYluzAX9.7pQUgpNMmncWupFp8oTJKeshOrtJ1x.','DL1130','Expresso','Jabari','Matatu','kimk.jpg','jabari.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(21,NULL,'Badder','badder.driver@matgo.co.ke','0733000021','$2b$12$j/3OJY1loxGoEkbUJI4EBOK/ifPPrXPfkoupYq/D2B.iieutxBgDO','DL1131','Embasava','Brawlout','Matatu','badder.jpg','brawlout.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(22,NULL,'Ostoo','ostoo.driver@matgo.co.ke','0733000022','$2b$12$7h9eGSP4RUFcDDYUiuAoqeG8qjnZhIlHu0YS5xgBxmx3x20er2Qaa','DL1132','Embasava','MoneyFest','Matatu','ostoo.jpg','moneyfest.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(23,NULL,'Huan','huan.driver@matgo.co.ke','0733000023','$2b$12$vIClDrgUrzUGJmovxSgrJuGDNpBrxirw518.u0tsaGPqBk72HmLXm','DL1133','Embasava','Heartless','Matatu','huan.jpg','heartless.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(24,NULL,'Evans','evans.driver@matgo.co.ke','0733000024','$2b$12$YMaxSWkGFg658CaQ6w8Vku.LZpE2U7N7MQYDbzJtExBs6Yv/Pi41S','DL1134','Embasava','Matrix','Matatu','evans.jpg','matrix.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(25,NULL,'Lenny','lenny.driver@matgo.co.ke','0733000025','$2b$12$hLg7F5Nr2Nr4bsoQpz4xTOIBC.ZgQ7xCcMYvcJxjTia0KYeoYbDJi','DL1135','Embasava','Mood','Matatu','lenny.jpg','mood.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(26,NULL,'Dan','danemb.driver@matgo.co.ke','0733000026','$2b$12$kkgenVU97V77OxteItha8Os5KYl/dZul2YrSx14wXLuIK3jM4TpTm','DL1136','Embasava','Genesis','Matatu','danemb.jpg','genesis.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(27,NULL,'Kelvin','kelvin.driver@matgo.co.ke','0733000027','$2b$12$lNAY9FH4RtS1zSD.zPRP6ujS8n0ufRseUs.b3GJuWrOxQwAPIHlGy','DL1137','Embasava','Restoration','Matatu','kelvin.jpg','restoration.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(28,NULL,'Evans','evanssm.driver@matgo.co.ke','0733000028','$2b$12$aku1haESF2lWRO7MnbSVeOUqGVxwRS3oy.xIiMVCsb/aPJ/ehDKdW','DL1138','Supermetro','1456','Matatu','evanssm.jpg','1456.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(29,NULL,'John','johnsm.driver@matgo.co.ke','0733000029','$2b$12$wwOzcpO4u2A81GaVT2qLmOrqjPEZc5/S3tEIXSkwFxIUgsZKy.ZGK','DL1139','Supermetro','3743','Matatu','johnsm.jpg','3743.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(30,NULL,'Maina','mainasm.driver@matgo.co.ke','0733000030','$2b$12$VSrORcIEigYL32v/kjDP9.7XKj7xrqwZ.4JfWZfgO6Br/G1r9Htc6','DL1140','Supermetro','8643','Matatu','mainasm.jpg','8643.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(31,NULL,'Charles','charlessm.driver@matgo.co.ke','0733000031','$2b$12$Xv1MQI6nFfYIcRtWEF3Q1e5NBZSyFjO.l4F1dyNlA.6gC6ZR8I9bW','DL1141','Supermetro','3737','Matatu','charlessm.jpg','3737.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(32,NULL,'Nahbeel','nahbeelsm.driver@matgo.co.ke','0733000032','$2b$12$m39CFGDXkAbZpuFYuBbJn.rmhNwuPt.BJi0VePjd4betpmM7Lkz96','DL1142','Supermetro','1234','Matatu','nahbeelsm.jpg','1234.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(33,NULL,'Kelvin','kelvinsm.driver@matgo.co.ke','0733000033','$2b$12$iGuYloxYENE/zqyopl01Ee5LA0UTsz8u93IMRVy7BoMM87ZAm1D7e','DL1143','Supermetro','0001','Matatu','kelvinsm.jpg','0001.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(34,NULL,'James','jamessm.driver@matgo.co.ke','0733000034','$2b$12$OVomCIgTirJb8z3wgcf5OuFe0M1K4MXmjPIufKRS2yxxU3oEyExS6','DL1144','Supermetro','19373','Matatu','jamessm.jpg','19373.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(35,NULL,'Steve','stevesm.driver@matgo.co.ke','0733000035','$2b$12$TYi/J3waazk1zprmKTtXMOATqH4YG1dHfodW0r//i/xPGuWfnDgpC','DL1145','Supermetro','12349','Matatu','stevesm.jpg','12349.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(36,NULL,'Ryan','ryansm.driver@matgo.co.ke','0733000036','$2b$12$598bxN51OVg9t9jzCwwTQ.tPn1z01JS8RVNXqPI33JtlK8jav3Tz.','DL1146','Supermetro','23456','Matatu','ryansm.jpg','23456.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(37,NULL,'Adri','adrism.driver@matgo.co.ke','0733000037','$2b$12$LEn.EYBpEipTWtUpcq.cvuJPG9HzXIVNbHMR/K8qB32yTNImDCOHu','DL1147','Supermetro','32456','Matatu','adrism.jpg','32456.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30'),
(38,NULL,'Soshi','soshism.driver@matgo.co.ke','0733000038','$2b$12$MfLqnh33wAUFfdsl42vCGeVi8XcAQH9/HN7YhFsvUYvWz62OdGDke','DL1148','Supermetro','78902','Matatu','soshism.jpg','78902.jpg',NULL,1,'2025-07-31 20:54:30','2025-07-31 20:54:30');
/*!40000 ALTER TABLE `Drivers` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Matatus`
--

DROP TABLE IF EXISTS `Matatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Matatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sacco` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `busType` varchar(255) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Regular',
  `capacity` int(11) DEFAULT 14,
  `status` varchar(255) DEFAULT 'Active',
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `departureSchedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`departureSchedule`)),
  `price` decimal(10,2) DEFAULT NULL,
  `qrCode` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Matatus`
--

LOCK TABLES `Matatus` WRITE;
/*!40000 ALTER TABLE `Matatus` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Matatus` VALUES
(1,'NTVRS','X-Rated','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(2,'NTVRS','Phenomenal','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(3,'NTVRS','CyberPunk','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(4,'NTVRS','Harukaze','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(5,'NTVRS','Ikigai','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(6,'NTVRS','Mellows','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(7,'NTVRS','Stormzy','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(8,'NTVRS','Monalisa','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(9,'NTVRS','Spice','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(10,'NTVRS','Spurs','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(11,'NTVRS','Explicit','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(12,'NTVRS','SCrilla','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(13,'Expresso','Baba Yaga','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(14,'Expresso','Moxie','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(15,'Expresso','Ferari','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(16,'Expresso','Detroit','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(17,'Expresso','Gamer','Matatu','Kasarani',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(18,'Expresso','Funka Delica','Matatu','Kasarani',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(19,'Expresso','Malkia','Matatu','Kasarani',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(20,'Expresso','Jabari','Matatu','Kasarani',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(21,'Embasava','Brawlout','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(22,'Embasava','MoneyFest','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(23,'Embasava','Heartless','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(24,'Embasava','Matrix','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(25,'Embasava','Mood','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(26,'Embasava','Genesis','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(27,'Embasava','Restoration','Matatu','Embakasi',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(28,'Supermetro','1456','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(29,'Supermetro','3743','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(30,'Supermetro','8643','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(31,'Supermetro','3737','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(32,'Supermetro','1234','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(33,'Supermetro','0001','Matatu','Ngong',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(34,'Supermetro','19373','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(35,'Supermetro','12349','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(36,'Supermetro','23456','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(37,'Supermetro','32456','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL),
(38,'Supermetro','78902','Matatu','Rongai',0,'2025-07-31 20:50:53','2025-07-31 20:50:53',NULL,'Regular',14,'Active',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Matatus` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Passengers`
--

DROP TABLE IF EXISTS `Passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Passengers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  KEY `userId` (`userId`),
  CONSTRAINT `Passengers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Passengers`
--

LOCK TABLES `Passengers` WRITE;
/*!40000 ALTER TABLE `Passengers` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Passengers` VALUES
(1,NULL,'Laurine Onana','onanalaurine4@gmail.com','0711000001','$2b$12$/dXHvVTEIjerYu10N6FjuO4J0cmy8yxvl4uZHSFlL9yljLPemMTUG','laurine.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09'),
(2,NULL,'Ariam Nyariana','ariamnyariana2@gmail.com','0711000002','$2b$12$0IOn6npqCLaCELUlOSVx0uKl3OFUtM04PkXnBhuaOLBQRRoMsKD4W','Ariam.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09'),
(3,NULL,'Allan Kimani','allan.wachuka@strathmore.edu','0711000003','$2b$12$tKsljWAo68fzBrRZKii.Q.W0w3h6Nok8Ppmmx1jA7UinHrS07QP/O','Allan.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09'),
(4,NULL,'Alice Wanjiru','alicewanjiru@gmail.com','0711000004','$2b$12$NaBHuVVQBbQVAyl4mzG95.stWfQ5UIHHQeN3GWNemH68qDTlbaajS','Alice.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09'),
(5,NULL,'Ariam Kimani','ariamkim1@gmail.com','0711000005','$2b$12$MvM7TkHTQbgb7xtjXrwi0OT/vDcW8R3vu3AHWFh2FFtIqgW387yNm','Ariamkim.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09'),
(6,NULL,'Kim Kimani','kimkimani@gmail.com','0711000006','$2b$12$JYfJzMXc6GOF0HZ9/bK8/.2Y0st3cOyqP.gUreTgtSVfRjcKK94F2','Kim.jpg',1,'2025-07-31 20:38:09','2025-07-31 20:38:09');
/*!40000 ALTER TABLE `Passengers` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Routes`
--

DROP TABLE IF EXISTS `Routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Routes`
--

LOCK TABLES `Routes` WRITE;
/*!40000 ALTER TABLE `Routes` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Routes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `SaccoAdmins`
--

DROP TABLE IF EXISTS `SaccoAdmins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `SaccoAdmins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `saccoName` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `routes` text DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 1,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  KEY `userId` (`userId`),
  CONSTRAINT `SaccoAdmins_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SaccoAdmins`
--

LOCK TABLES `SaccoAdmins` WRITE;
/*!40000 ALTER TABLE `SaccoAdmins` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `SaccoAdmins` VALUES
(1,NULL,'NTVRS','Ntvrs Kajiado','ntvrs@sacco.co.ke','0722000001','$2b$12$CbNKscRW5UU3VvnHbEpTdOuhAxarfpF/gLH12BfHnzN6nkZKKpF72','Ngong,Rongai',1,'NTVRS.png','2025-07-31 20:49:12','2025-07-31 20:49:12'),
(2,NULL,'Supermetro','Super Metro','supermetro@sacco.co.ke','0722000002','$2b$12$FYOZPrnWCZN5GpXvJ0BgMO5vbvbAQZv//V1vrikmewafdqy0TiyMG','Ngong,Rongai',1,'SuperMetro.png','2025-07-31 20:49:12','2025-07-31 20:49:12'),
(3,NULL,'Expresso','Expresso Limited','expresso@sacco.co.ke','0722000003','$2b$12$YDWBwBkq2MvgMTxXaD5PCuDWHZpWVzNjX4DFBSWY0h7mUgFshNZWO','Kasarani,Ngong,Rongai',1,'Expresso.png','2025-07-31 20:49:12','2025-07-31 20:49:12'),
(4,NULL,'Embasava','Emba Pesa','embasava@sacco.co.ke','0722000004','$2b$12$XFA8B6QWwZ5dFZM.xwkWl.XwRPyGk2AMEOyOg8cFkZZqY1EuxRSUS','Embakasi',1,'Embasava.png','2025-07-31 20:49:12','2025-07-31 20:49:12');
/*!40000 ALTER TABLE `SaccoAdmins` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `SequelizeMeta` VALUES
('20250825_add_long_distance_fields.js'),
('20250825_add_qrcode_to_matatus.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `SystemAdmins`
--

DROP TABLE IF EXISTS `SystemAdmins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `SystemAdmins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `privileges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`privileges`)),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `SystemAdmins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemAdmins`
--

LOCK TABLES `SystemAdmins` WRITE;
/*!40000 ALTER TABLE `SystemAdmins` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `SystemAdmins` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Trips`
--

DROP TABLE IF EXISTS `Trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `origin` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `departureTime` datetime NOT NULL,
  `arrivalTime` datetime DEFAULT NULL,
  `fare` float NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `driverId` int(11) DEFAULT NULL,
  `matatuId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driverId` (`driverId`),
  KEY `matatuId` (`matatuId`),
  CONSTRAINT `Trips_ibfk_5` FOREIGN KEY (`driverId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Trips_ibfk_6` FOREIGN KEY (`matatuId`) REFERENCES `Matatus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trips`
--

LOCK TABLES `Trips` WRITE;
/*!40000 ALTER TABLE `Trips` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `Trips` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` enum('passenger','driver','conductor','sacco_admin','system_admin') NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `approved` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `Users` VALUES
(1,'Allan Kimani','allanohkim78@gmail.com','0105127824','passenger','1753975385640-profilePic.png','$2b$10$UzSz3HtQiIoOXceq7bINL.fZQgbXOffBDb0rZOQ1cR0PyRhjyBInW',1,'2025-07-31 15:23:05','2025-07-31 15:23:05'),
(2,'Laurine  Onana','onanalaurine4@gmail.com','0795711866','passenger','1753976997113-profilePic.jpeg','$2b$10$PaUjFrwM8GptQo5M4cRbdOMz.y/s7DtROgZAjG8O3ahS.OurqDPPS',1,'2025-07-31 15:49:57','2025-07-31 15:49:57'),
(3,'System Admin','admin@matgo.co.ke','0711999999','system_admin','admin.png','$2b$12$CIMxOHilo9bpwG9bqhcr7uThuvAxAvcfwMRROmZLQcm3oNN1l9nyy',1,'2025-07-31 20:44:24','2025-07-31 20:44:24'),
(17,'Ariam Nyariana','ariamnyariana2@gmail.com','0711000002','passenger','Ariam.jpg','$2b$12$uhRSWMJcV0N6F7Sgj44PZ.lNLqapOGAF11d7POMDgm.3JD5.POeoe',1,'2025-07-31 20:45:34','2025-07-31 20:45:34'),
(18,'Allan Kimani','allan.wachuka@strathmore.edu','0711000003','passenger','Allan.jpg','$2b$12$Pwx9/2TowDGRWtnp8i0h/O6xatru50P7qOzPqcsad0AGm5G0v2wFy',1,'2025-07-31 20:45:34','2025-07-31 20:45:34'),
(19,'Alice Wanjiru','alicewanjiru@gmail.com','0711000004','passenger','Alice.jpg','$2b$12$Sexs5VEh.8D68dlUss7HBOpc6nlpMneTW8L5GwzjCXoK81AQBGF86',1,'2025-07-31 20:45:34','2025-07-31 20:45:34'),
(20,'Ariam Kimani','ariamkim1@gmail.com','0711000005','passenger','Ariamkim.jpg','$2b$12$jRqvB.fq1Oi8tdNN/0qNxehoCEOT5JV0N8STEsXmmzNdrIOucxhke',1,'2025-07-31 20:45:34','2025-07-31 20:45:34'),
(21,'Kim Kimani','kimkimani@gmail.com','0711000006','passenger','Kim.jpg','$2b$12$FKZ3Gp5InjBZKhYrPQvU.OwJ65oHzlfli9djGKLjfF6jVqivaDxZi',1,'2025-07-31 20:45:34','2025-07-31 20:45:34'),
(22,'Ntvrs Kajiado','ntvrs@sacco.co.ke','0722000001','sacco_admin','NTVRS.png','$2b$12$0BzH2qLvvK9e5spob.nncetmGtaFbkEFkFFGbpVRiacBVlwvwDAPS',1,'2025-07-31 20:49:22','2025-07-31 20:49:22'),
(23,'Super Metro','supermetro@sacco.co.ke','0722000002','sacco_admin','SuperMetro.png','$2b$12$oKHFLdumzs24R7jTdtlEEeknaS93Bzz1mTfqcbu/OF.aLFoZ3OpNu',1,'2025-07-31 20:49:22','2025-07-31 20:49:22'),
(24,'Expresso Limited','expresso@sacco.co.ke','0722000003','sacco_admin','Expresso.png','$2b$12$Xo49Y3wceOV7L8ZNXU2pieKsNOQqM2DtmN79LmZ2SNh5CRB9azW5y',1,'2025-07-31 20:49:22','2025-07-31 20:49:22'),
(25,'Emba Pesa','embasava@sacco.co.ke','0722000004','sacco_admin','Embasava.png','$2b$12$kVStG9b8/KTshmq19994iu2B0yH5YkdcmQcG8jtJUKIYEZw1upCOa',1,'2025-07-31 20:49:22','2025-07-31 20:49:22'),
(26,'Ochila','ochila.driver@matgo.co.ke','0733000001','driver','ochila.jpg','$2b$12$dAIaW7X6cdXy3XFB8XDLp.x5g9B38KqsBZZ294m7cugv3ygGB7QLC',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(27,'Dan','dan.driver@matgo.co.ke','0733000002','driver','dan.jpg','$2b$12$TnMsRZw6PP.199dajb4U2OC12SihXUAFgDKbiwZ.zAys/Z9PJ5Deu',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(28,'Steven','steven.driver@matgo.co.ke','0733000003','driver','steven.jpg','$2b$12$dHNcdui.hWMHNxQSLQi2.OoYra1DvncL2f6pjoUguXQDMk33aJEtW',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(29,'Brian','brian.driver@matgo.co.ke','0733000004','driver','brian.jpg','$2b$12$7DQFjikkz/0TfKS3O3vvM.cWxRKCRbvQCO84N4YX874cJ2IYj3tOG',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(30,'Otieno','otieno.driver@matgo.co.ke','0733000005','driver','otieno.jpg','$2b$12$ck3BRxgEZ0Mpn0JjnxA1oOojz1kGbNkd3HhZccEvZiyRwtTSmzjSm',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(31,'Dante','dante.driver@matgo.co.ke','0733000006','driver','dante.jpg','$2b$12$mRJNo/LCNA/F8Kmg6gqcdeoBi3oWJP9l0hVc5A8Z9JBNudQYmG38q',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(32,'Alex','alex.driver@matgo.co.ke','0733000007','driver','alex.jpg','$2b$12$1WZ279VQK3GPW9cC6858NO0xgUOXbhFut8UfnZEe.x/IOvwfL57Ky',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(33,'Dave','dave.driver@matgo.co.ke','0733000008','driver','dave.jpg','$2b$12$83GeBpEiWMy6lyMVx33jD.HbL/1qK1Ge2RcRqXYf/8XVwYauyDoAq',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(34,'Benjamin','benjamin.driver@matgo.co.ke','0733000009','driver','benjamin.jpg','$2b$12$G9B6sEKUUzv9f7JHiu9i7u7gj/jXVcWI0bWYvvs.cH3hbiLfYokku',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(35,'Martin','martin.driver@matgo.co.ke','0733000010','driver','martin.jpg','$2b$12$ltH7S7r1gLBwEwO.0vlkuehXNU7MOlF53mI4TCw1gyicqSM8VIyQ.',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(36,'John','john.driver@matgo.co.ke','0733000011','driver','john.jpg','$2b$12$pYCU.ZE4Uv4OfBXQNIQRGuNOIVoa4p/47zxPtD1fR18XOpTV3VbLS',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(37,'Roy','roy.driver@matgo.co.ke','0733000012','driver','roy.jpg','$2b$12$kDWb2BS1wtEgjrS8sODrEOjlMTgruh5x8Y7o8efqqt/jZ7DCCQzym',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(38,'Allan','allan.driver@matgo.co.ke','0733000013','driver','allan.jpg','$2b$12$8CwgnhLggirFYXlm1A6HROyDIcJPUMxbR37dtbnFmwN4SG7g40nvq',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(39,'Jeff','jeff.driver@matgo.co.ke','0733000014','driver','jeff.jpg','$2b$12$Zs5pujW4Z9cxED1xZ28yCOehjKG64Qwh/1F00GKMduWAAEGLVGDVS',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(40,'Moses','moses.driver@matgo.co.ke','0733000015','driver','moses.jpg','$2b$12$gZjadB7bDpw475ZSN2AakOhWqtZ9IX838MHeNrIB5I8bag8RvL2A6',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(41,'Andrew','andrew.driver@matgo.co.ke','0733000016','driver','andrew.jpg','$2b$12$hkDd95//P9wLqXgGPlamaOgcgfkugwBpj2JnlLZ1dn8WPzYX7KJ4q',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(42,'Dante','dantek.driver@matgo.co.ke','0733000017','driver','dantek.jpg','$2b$12$JbRbleiwMYaDYKlEdr.OYe.9YJ9BwjNQnhDbM65ERMgB.C6Z44Wu6',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(43,'Kibe','kibe.driver@matgo.co.ke','0733000018','driver','kibe.jpg','$2b$12$smWcROF2JnJosVzseNyQ0.EBh8bF1TRWLp40qz/.QCg0DR/hiNq7q',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(44,'Abra','abra.driver@matgo.co.ke','0733000019','driver','abra.jpg','$2b$12$1TVLGbpXYWtra3B2N.FCOeJiJ7BkzubAR7iHfaabzV3ptIcrWAW1K',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(45,'Kim','kimk.driver@matgo.co.ke','0733000020','driver','kimk.jpg','$2b$12$ExG0Y7M.BAKgc.JDLvC6ue2WBl7OGmcFHq4ZIH.mwByYWd6LfXsr6',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(46,'Badder','badder.driver@matgo.co.ke','0733000021','driver','badder.jpg','$2b$12$cOv2uSv8rxXdDHEbtzVuGOp6xlozimSbJmuu0qwXYjCdl0iiXPAiK',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(47,'Ostoo','ostoo.driver@matgo.co.ke','0733000022','driver','ostoo.jpg','$2b$12$qLbnmy.xcu440.NDa4tDHe.7XoPJ7Ba5sKGmjHGfXJfg1ZsPZnNZ6',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(48,'Huan','huan.driver@matgo.co.ke','0733000023','driver','huan.jpg','$2b$12$R2CmK3559Afds40V.QJgl.a4LYa1CsFAtvBeTnVYHwzbA9k21Sz42',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(49,'Evans','evans.driver@matgo.co.ke','0733000024','driver','evans.jpg','$2b$12$dUMdkFNVu3cYxRM0ItTlbuctUm4diA0MiTf7JZR4MUkgZvnsH.xxC',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(50,'Lenny','lenny.driver@matgo.co.ke','0733000025','driver','lenny.jpg','$2b$12$RP.FH9STDmd3Z7V6l/oTYeBDYRlbPHENqtn.VmQek0tm2/BOrt8iq',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(51,'Dan','danemb.driver@matgo.co.ke','0733000026','driver','danemb.jpg','$2b$12$E7fhsn4UsjgsQ9bfoQaptuUah1NLnLFQCxLAqJOqKdapUbzROxOUW',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(52,'Kelvin','kelvin.driver@matgo.co.ke','0733000027','driver','kelvin.jpg','$2b$12$I/vfLJfSprD25E5MsZRiM..VkzlaIT1EVUOlqlaCfFEHKII7MW98C',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(53,'Evans','evanssm.driver@matgo.co.ke','0733000028','driver','evanssm.jpg','$2b$12$ko/4rYDUIU2NlWjAOb7me.Qcwu8ymNE0dlO7WSnbsya6D8rMiME4S',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(54,'John','johnsm.driver@matgo.co.ke','0733000029','driver','johnsm.jpg','$2b$12$EPq16ihOCC4wxroBNf7O9eRIABc3EZg770XrXAlC0X7iNOfpO/1Dm',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(55,'Maina','mainasm.driver@matgo.co.ke','0733000030','driver','mainasm.jpg','$2b$12$RW6hbRESWXHtMHTjg.771.uK6Tb7WVwEQkVrY8VDMhHN63RdBrm3.',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(56,'Charles','charlessm.driver@matgo.co.ke','0733000031','driver','charlessm.jpg','$2b$12$sTx/6yludYTgHmNFU/rNXeuYPcMPoIg.Nd9o5Ehecq3T2/x9Pwzim',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(57,'Nahbeel','nahbeelsm.driver@matgo.co.ke','0733000032','driver','nahbeelsm.jpg','$2b$12$pQlx701a.mzArBDlTA8pf..sQ4bae2GpTlYNv6ccs0uwdwqKJLxtK',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(58,'Kelvin','kelvinsm.driver@matgo.co.ke','0733000033','driver','kelvinsm.jpg','$2b$12$XGTGwkHfzc.Tbd4JnZu9/ekLD5xU5jaJdUEjjEd1CXsb4fuGMPBXe',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(59,'James','jamessm.driver@matgo.co.ke','0733000034','driver','jamessm.jpg','$2b$12$Y1z0BhfTcaupI8GT0Ct8GuNw9pGa/6SDWgwW9.C9XboKxymK0UHxK',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(60,'Steve','stevesm.driver@matgo.co.ke','0733000035','driver','stevesm.jpg','$2b$12$Mnxr1O8f2XLOCQ99CJNHTe9Egl//g8RSE.y23Bt3hMRjkMXe7MRuq',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(61,'Ryan','ryansm.driver@matgo.co.ke','0733000036','driver','ryansm.jpg','$2b$12$fUGKemK.EeV1KwbzUzgQpe3lcKbPuzbdaGP/.xmWJs6jdJFp7KYbm',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(62,'Adri','adrism.driver@matgo.co.ke','0733000037','driver','adrism.jpg','$2b$12$lddMkNcwmK4T5KCXo8kPyOjSGC.J15Gs2ZOuGaoZxU2LQjMHFQgpa',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(63,'Soshi','soshism.driver@matgo.co.ke','0733000038','driver','soshism.jpg','$2b$12$PmZKAXIaAMr/vjZj4pdiyupiESvQMhT.dzZtVMA3sWNLmFp2j/KBu',1,'2025-07-31 20:56:01','2025-07-31 20:56:01'),
(64,'Theo','theo.conductor@matgo.co.ke','0744000001','conductor','theo.jpg','$2b$12$eMzzLIJO7XRvSzRhbjEL5.XAvUyz2TRykDyxHlRmu5BSLySImeKOu',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(65,'Deni','deni.conductor@matgo.co.ke','0744000002','conductor','deni.jpg','$2b$12$DFfr6e7cza6YnuDoM77EKOaX3AgZx9XH.QZYwX4BB3/2aEg8b6xvu',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(66,'Ivor','ivor.conductor@matgo.co.ke','0744000003','conductor','ivor.jpg','$2b$12$5tv3o4Km4JSA/YZ8TCnkn.1sJ1t3DrXMJYL0a2ut.2xbTXLBQ3.oq',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(67,'Matt','matt.conductor@matgo.co.ke','0744000004','conductor','matt.jpg','$2b$12$aJqLXaISVaWAiQu.cy/Kz.MyK4MDEOENtRjMEhn9Mc8OJNlp05O4.',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(68,'Tman','tman.conductor@matgo.co.ke','0744000005','conductor','tman.jpg','$2b$12$8r5DzSDattXKbM8tmkqTSucMIBbu.5FlIzyo2jlqT3mXaST.g4NJa',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(69,'Ellie','ellie.conductor@matgo.co.ke','0744000006','conductor','ellie.jpg','$2b$12$vo.juW60VpPyAfdV5J03t.xU.5VUBotSHRRnq8mBH/Uw0areaORUu',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(70,'Renee','renee.conductor@matgo.co.ke','0744000007','conductor','renee.jpg','$2b$12$HtwaQ6CwMcOvwZy4ogxUVe8nci8G7218HyKaCHZLFeS1n2p.1luAK',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(71,'Nachi','nachi.conductor@matgo.co.ke','0744000008','conductor','nachi.jpg','$2b$12$9hB0UlF0ZsmnSE3vR3a1U.CHn/fIHJFiCq.EUEIhuAcpDqecSqPqW',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(72,'JVB','jvb.conductor@matgo.co.ke','0744000009','conductor','jvb.jpg','$2b$12$fWQvc3DeYITqPvwjiKblX.r9OTDNPFauTR5TlhlJzx1YhH2VgQnKa',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(73,'Slim','slim.conductor@matgo.co.ke','0744000010','conductor','slim.jpg','$2b$12$swcceGgQ1fbEmdUU5WwOLe5.d/7U.MQkELkNCMApl.CibXQXi0Fqa',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(74,'Maverick','maverick.conductor@matgo.co.ke','0744000011','conductor','maverick.jpg','$2b$12$9fr21UF./Rtf8PG6mTZZEu.xaNM/EPkI3/6ei3b.L4AUFZ.V4yAG6',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(75,'Drakoo','drakoo.conductor@matgo.co.ke','0744000012','conductor','drakoo.jpg','$2b$12$ItwyVSaqpfeuKeBxXFUxOeM/3YUYLxJVvyedw3eZmZB1RKOrJ8opq',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(76,'Ben','ben.conductor@matgo.co.ke','0744000013','conductor','ben.jpg','$2b$12$UPqL1Sh49S1Z1hk7Cv6IKOWK5XmgnodnmfDxEK3vHsz07ek3Rqec6',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(77,'Kim','kim.conductor@matgo.co.ke','0744000014','conductor','kim.jpg','$2b$12$HY3htyF45xXg2B0RqxIDc.bkbs8u.Gmkmt9NZUtAghLAoQNsUyShi',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(78,'Mwari','mwari.conductor@matgo.co.ke','0744000015','conductor','mwari.jpg','$2b$12$ojvT53Vfa00enC6zTInFXeN1P31u98z1ndiy4XPIQOuh8O4Bb5CRG',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(79,'Mwas','mwas.conductor@matgo.co.ke','0744000016','conductor','mwas.jpg','$2b$12$5Zey4OdnwQvlwr56SSxxle3Iwd7jLZVWD3xf6H7Ta8JTe1iveDbvG',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(80,'Davi','davi.conductor@matgo.co.ke','0744000017','conductor','davi.jpg','$2b$12$XNnc3okOwyj3BxLVNxM/iOP9Vn3MgkyWoiK.vxIIvClaQtkVAG2cC',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(81,'Smith','smith.conductor@matgo.co.ke','0744000018','conductor','smith.jpg','$2b$12$0IR2hwVtFPfLpcQbyF9w6OflfrQWlYabxQNYRUiBSqEXC7k1RXqni',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(82,'Hypr','hypr.conductor@matgo.co.ke','0744000019','conductor','hypr.jpg','$2b$12$1IZNeSuk5oVX6hQKNFd5yOMgZ9vbwFweTZVVt2wRdEk36J8NveAjK',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(83,'Capi','capi.conductor@matgo.co.ke','0744000020','conductor','capi.jpg','$2b$12$VOW0Bj90khkngTid.Lj39OfxHgtLT6JVUqnrYYmnN0w9e9Wsww.cG',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(84,'Moses','moses.conductor@matgo.co.ke','0744000021','conductor','moses.jpg','$2b$12$nM.b8YcLHE2n6lQY4b6xmuPN.nwDwFkFLR8v6keEufBmvX66eiR3W',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(85,'Qodo','qodo.conductor@matgo.co.ke','0744000022','conductor','qodo.jpg','$2b$12$/WPuGIhMRPnq.uRHvGNqQ.PR3drLbCvUsM2VFzbG6lSp7P7RsN1j.',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(86,'Gemmi','gemmi.conductor@matgo.co.ke','0744000023','conductor','gemmi.jpg','$2b$12$R8WB1X0xHrvoHo6jxFLAD.t5dUkcZvqP89gruT6.Aai2NsOJHkqCy',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(87,'Kilo','kilo.conductor@matgo.co.ke','0744000024','conductor','kilo.jpg','$2b$12$3TKXVcOAnR4qzz2.3W4xYOWURrmnM44aNx1.UeaBh8Lal.U0Tasua',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(88,'Mkuu','mkuu.conductor@matgo.co.ke','0744000025','conductor','mkuu.jpg','$2b$12$0kMyv1kimRQPH4jyeLTFtu8MM7RpoWRjiz75z4JfelgcTAPNK16cO',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(89,'Jade','jade.conductor@matgo.co.ke','0744000026','conductor','jade.jpg','$2b$12$AZlUBGEgh.arIDSkRF612OEZBU3UinWl/26GE7VKmdiCjRHfdQH3q',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(90,'Resto','resto.conductor@matgo.co.ke','0744000027','conductor','resto.jpg','$2b$12$mTphUqOoUuLVRzloHST2OO0Lay0ayKor/fCT5NTErP3f06DQx4aGW',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(91,'John','johnsm.conductor@matgo.co.ke','0744000028','conductor','johnsm.jpg','$2b$12$2bIL6VeoH0IZC9FqThg9QOjkj9VqmnJniJMEBlw3.Jq33xcBWnPVK',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(92,'Kelvin','kelvinsm.conductor@matgo.co.ke','0744000029','conductor','kelvinsm.jpg','$2b$12$Zxf2w0Kg9cONtKsULVdkbOepYThMax0DJdnT44zQF4jJit.EigmD.',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(93,'Steve','stevesm.conductor@matgo.co.ke','0744000030','conductor','stevesm.jpg','$2b$12$QbB4c2eC5k22dz0UViASgeVX0Gxl9GYG6Lsz5pIF8umShmAQk77fq',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(94,'Ryan','ryansm.conductor@matgo.co.ke','0744000031','conductor','ryansm.jpg','$2b$12$4x2PkmntoXtVE6JNsn2GJuy/3V8GBCkjnwvaLu7G2Xprcm3qxoBL.',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(95,'Maina','mainasm.conductor@matgo.co.ke','0744000032','conductor','mainasm.jpg','$2b$12$vSPeJ.UTd7BDSRZrAxPR/en9yNTBTvKomBFd65Afu5WoVLPHjCH1K',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(96,'James','jamessm.conductor@matgo.co.ke','0744000033','conductor','jamessm.jpg','$2b$12$5SXSjQDm66NfNYMEOMCEaexzzZrfU9XBTA2LcNBIu2MLex/f7Zn0q',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(97,'Kelvin','kelvinsm2.conductor@matgo.co.ke','0744000034','conductor','kelvinsm2.jpg','$2b$12$qJ6UUW824Kmg2j.wiK02/uWJx1hLs0xcBSmXN2E.oWmDUahgJoieu',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(98,'Charles','charlessm.conductor@matgo.co.ke','0744000035','conductor','charlessm.jpg','$2b$12$imqWdCaXchsR1SrVi3dIpu4Won30PtU27h.e3VsQG1KdeKIDyL50i',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(99,'John','johnsm2.conductor@matgo.co.ke','0744000036','conductor','johnsm2.jpg','$2b$12$kAZIJEVN.tNGLudfjMPLSuFnLmmDSyQKkrGszcscZhCwL9CsibHFS',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(100,'Maina','mainasm2.conductor@matgo.co.ke','0744000037','conductor','mainasm2.jpg','$2b$12$HBLTtIKUqqyZc5Gl4u9Ncupll.AA6CbfruU2MHW5muy.d5UulgM8S',1,'2025-07-31 20:59:09','2025-07-31 20:59:09'),
(101,'Evans','evanssm.conductor@matgo.co.ke','0744000038','conductor','evanssm.jpg','$2b$12$/DltjSl0B7M0vh6CgwQMgu/v0KQu0kae.ML2C5CX5uw8c/wD8TrP.',1,'2025-07-31 20:59:09','2025-07-31 20:59:09');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `short_routes`
--

DROP TABLE IF EXISTS `short_routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `short_routes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `short_routes`
--

LOCK TABLES `short_routes` WRITE;
/*!40000 ALTER TABLE `short_routes` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `short_routes` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-08-26 18:44:18
