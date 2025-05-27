-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2025 at 11:48 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `safehaven_chat_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL,
  `session_id` varchar(255) NOT NULL COMMENT 'Unique identifier for each chat session',
  `username` varchar(255) NOT NULL,
  `sender` enum('user','counselor') NOT NULL COMMENT 'Indicates who sent the message (user or counselor)',
  `message_content` text NOT NULL COMMENT 'The actual content of the chat message',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'The date and time the message was sent',
  `counselor_name` varchar(255) DEFAULT NULL COMMENT 'The name of the counselor, if applicable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `session_id`, `username`, `sender`, `message_content`, `timestamp`, `counselor_name`) VALUES
(1, '257e32f6-7673-4e34-b1c5-bc13327f8540', '', 'user', 'hello', '2025-05-27 10:29:16', 'Lindiwe'),
(2, '257e32f6-7673-4e34-b1c5-bc13327f8540', '', 'user', 'i have an abusive husband', '2025-05-27 10:29:28', 'Lindiwe'),
(3, '257e32f6-7673-4e34-b1c5-bc13327f8540', '', 'user', 'yes', '2025-05-27 10:29:48', 'Lindiwe'),
(4, '257e32f6-7673-4e34-b1c5-bc13327f8540', '', 'user', 'how do i create a safety plan', '2025-05-27 10:30:02', 'Lindiwe'),
(5, 'session_mbali_7fdc5ced-7364-4a48-a613-e7410484e785', 'mbali', 'user', 'hello', '2025-05-27 10:43:54', 'Thabo'),
(6, 'session_mbali_7fdc5ced-7364-4a48-a613-e7410484e785', 'mbali', 'user', 'i am sad', '2025-05-27 10:44:00', 'Thabo'),
(7, 'session_mbali_7fdc5ced-7364-4a48-a613-e7410484e785', 'mbali', 'user', 'my boyfried is abusive', '2025-05-27 10:44:17', 'Thabo'),
(8, 'session_mbali_7fdc5ced-7364-4a48-a613-e7410484e785', 'mbali', 'user', 'i want to leave him', '2025-05-27 10:44:34', 'Thabo'),
(9, 'session_hello_115919c5-5b27-4034-9f0a-066044c689f6', 'hello', 'user', 'hello', '2025-05-27 11:37:40', 'Sipho'),
(10, 'session_hello_115919c5-5b27-4034-9f0a-066044c689f6', 'hello', 'user', 'how are you', '2025-05-27 11:37:44', 'Sipho'),
(11, 'session_hello_115919c5-5b27-4034-9f0a-066044c689f6', 'hello', 'user', 'stressed', '2025-05-27 11:37:53', 'Sipho');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_session_id` (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
