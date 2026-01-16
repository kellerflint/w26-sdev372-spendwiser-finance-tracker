USE spendwiser;

DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hobby VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  location VARCHAR(255),
  amount DECIMAL(8,2) NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
