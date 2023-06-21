--Creating database for your datas
create database i;

--Creating Employee table
CREATE TABLE tbl_Employee (
    employee_name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    PRIMARY KEY(employee_name)
);

---Creating Company table
CREATE TABLE tbl_Company (
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    PRIMARY KEY(company_name)
);

--Creating works table
CREATE TABLE tbl_Works (
    employee_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_name) REFERENCES tbl_Employee(employee_name),
    FOREIGN KEY (company_name) REFERENCES tbl_Company(company_name),
    company_name VARCHAR(255),
    salary DECIMAL(10, 2)
);

--Creating Manages table
CREATE TABLE tbl_Manages (
    employee_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_name) REFERENCES tbl_Employee(employee_name),
    manager_name VARCHAR(255)
);

INSERT INTO
    tbl_Employee (employee_name, street, city)
VALUES
    (
        'Alice Williams',
        '321 Maple St',
        'Houston'
    ),
    (
        'Sara Davis',
        '159 Broadway',
        'New York'
    ),
    (
        'Mark Thompson',
        '235 Fifth Ave',
        'New York'
    ),
    (
        'Ashley Johnson',
        '876 Market St',
        'Chicago'
    ),
    (
        'Emily Williams',
        '235 Fifth Ave',
        'New York'
    ),
    (
        'Michael Brown',
        '902 Main St',
        'Houston'
    ),
    (
        'Samantha Smith',
        '111 Second St',
        'Chicago'
    ),
(
        'Patrick',
        '123 Main St',
        'New Mexico'
    );

INSERT INTO
    tbl_Company (company_name, city)
VALUES
    ('Small Bank Corporation', 'Chicago'),
    ('ABC Inc', 'Los Angeles'),
    ('Def Co', 'Houston'),
    ('First Bank Corporation', 'New York'),
    ('456 Corp', 'Chicago'),
    ('789 Inc', 'Los Angeles'),
    ('321 Co', 'Houston'),
    ('Pongyang Corporation', 'Chicago');

INSERT INTO
    tbl_Works (
        employee_name,
        company_name,
        salary
    )
VALUES
    (
        'Patrick',
        'Pongyang Corporation',
        500000
    ),
(
        'Sara Davis',
        'First Bank Corporation',
        82500.00
    ),
    (
        'Mark Thompson',
        'Small Bank Corporation',
        78000.00
    ),
    (
        'Ashley Johnson',
        'Small Bank Corporation',
        92000.00
    ),
    (
        'Emily Williams',
        'Small Bank Corporation',
        86500.00
    ),
    (
        'Michael Brown',
        'Small Bank Corporation',
        81000.00
    ),
    (
        'Samantha Smith',
        'Small Bank Corporation',
        77000.00
    );

INSERT INTO
    tbl_Manages(employee_name, manager_name)
VALUES
    ('Mark Thompson', 'Emily Williams'),
    -- ('John Smith', 'Jane Doe'),
    ('Alice Williams', 'Emily Williams'),
    ('Samantha Smith', 'Sara Davis'),
    ('Patrick', 'Jane Doe');

SELECT *
FROM
    tbl_Employee
ORDER BY
    employee_name;

SELECT *
FROM
    tbl_Works
ORDER BY
    employee_name;

SELECT *
FROM
    tbl_Company
ORDER BY
    company_name;

SELECT *
FROM
    tbl_Manages
ORDER BY
    company_name;

-- Update the value of salary to 1000 where employee name= John Smith and company_name = First Bank Corporation
UPDATE
    tbl_Works
SET
    salary = '1000'
WHERE
    employee_name = 'John Smith'
    AND company_name = 'First Bank Corporation';

--2(a) Find the names of all employees who work for First Bank Corporation.
SELECT
    employee_name
FROM
    tbl_Works
WHERE
    company_name = 'First Bank Corporation' 
    
--2(b) Find the names and cities of residence of all employees who work for First Bank Corporation.
SELECT
    employee_name,
    city
FROM
    tbl_employee
WHERE
    employee_name in (
        SELECT
            employee_name
        FROM
            tbl_Works
        WHERE
            company_name = 'First Bank Corporation'
    );


SELECT
    e.employee_name,
    e.city
FROM
    tbl_Employee AS e
    JOIN tbl_Works w ON w.employee_name = e.employee_name
WHERE
    company_name = 'First Bank Corporation';

--2(c)Find the names, street addresses, and cities of residence of all employees who work for
--First Bank Corporation and earn more than $10,000.
SELECT *
FROM
    tbl_employee
WHERE
    employee_name in (
        SELECT
            employee_name
        FROM
            tbl_Works
        WHERE
            company_name = 'First Bank Corporation'
            AND salary > 10000
    );



SELECT
    e.employee_name,
    e.street,
    e.city
FROM
    tbl_Employee AS e
    JOIN tbl_Works w ON w.employee_name = e.employee_name
WHERE
    w.company_name = 'First Bank Corporation'
    AND w.salary > 10000;

--2(d)Find all employees in the database who live in the same cities as the companies for
--which they work.
SELECT
    employee_name
FROM
    tbl_Employee
WHERE
    EXISTS(
        SELECT
            employee_name
        FROM
            tbl_Company
        WHERE
            employee_name IN (
                SELECT
                    employee_name
                FROM
                    tbl_Works
                WHERE
                    tbl_Works.company_name = tbl_Company.company_name
            )
            AND tbl_Company.city = tbl_Employee.city
    );



SELECT
    e.employee_name,
    e.city as empcity,
    w.company_name as workc,
    c.company_name as comp,
    c.city as compadd
FROM
    tbl_Employee as e
    JOIN tbl_Works w ON w.employee_name = e.employee_name
    JOIN tbl_Company c ON w.company_name = c.company_name
WHERE
    e.city = c.city;


--2(e) Find all employees in the database who live in the same cities and on the same streets
--as do their managers
SELECT
    e.employee_name,
    e.city AS emplcity,
    e.street AS emplstreet,
    m.manager_name AS manager,
    e1.city AS managercity,
    e1.street AS managestreet
FROM
    tbl_Employee AS e
    JOIN tbl_Manages m ON e.employee_name = m.employee_name
    JOIN tbl_Employee e1 ON m.manager_name = e1.employee_name
WHERE
    e1.city = e.city
    AND e1.street = e.street;


--2(f) Find all employees in the database who do not work for First Bank Corporation.
SELECT
    employee_name
FROM
    tbl_Works --yesle work table lai matra herxa so company ko name navako emplyee lai dekhauna unlike below
WHERE
    company_name <> 'First Bank Corporation'
ORDER BY
    employee_name;


SELECT
    e.employee_name
FROM
    tbl_employee e
    LEFT JOIN tbl_Works w ON e.employee_name = w.employee_name
WHERE
    w.employee_name IS NULL
    OR w.company_name != 'First Bank Corporation'
ORDER BY
    employee_name;


--2(g) Find all employees in the database who earn more than each employee of Small Bank
--Corporation.
SELECT
    e.employee_name
FROM
    tbl_Employee e
    JOIN tbl_Works w1 ON e.employee_name = w1.employee_name
    JOIN tbl_Works w2 ON w1.company_name <> w2.company_name
WHERE
    w2.company_name = 'Small Bank Corporation'
    AND w1.salary > w2.salary;


--2(h)Assume that the companies may be located in several cities. Find all companies located
--in every city in which Small Bank Corporation is located.
SELECT
    company_name,
    city
FROM
    tbl_Company
WHERE
    city =(
        SELECT
            city
        FROM
            tbl_Company
        WHERE
            company_name = 'Small Bank Corporation'
    )
    AND company_name <> 'Small Bank Corporation';


--2i Find all employees who earn more than the average salary of all employees of their
--company.
CREATE VIEW imade AS --this is done to create a table from the table made by combinatin of our code
SELECT
    company_name,
    AVG(salary) as S
FROM
    tbl_Works
GROUP BY
    company_name;

SELECT
    *
FROM
    tbl_Works
WHERE
    salary > (
        select
            s
        FROM
            imade
        WHERE
            imade.company_name = tbl_Works.company_name
    );


SELECT
    e.employee_name
FROM
    tbl_Employee e
    JOIN tbl_Works w ON e.employee_name = w.employee_name
WHERE
    w.salary > (
        SELECT
            AVG(salary)
        FROM
            tbl_Works
        WHERE
            company_name = w.company_name
    );



--2j-- Find the company that has the most employees
SELECT
    company_name,
    COUNT(employee_name) AS NunberOfEmployee
FROM
    tbl_Works
GROUP by
    company_name
HAVING
    COUNT(employee_name) = (
        SELECT
            MAX(emp_count)
        FROM
            (
                SELECT
                    COUNT(employee_name) AS emp_count
                FROM
                    tbl_Works
                GROUP BY
                    company_name
            ) AS COUNTS
    );

  --2k Find the company that has the smallest payroll.
SELECT
    company_name,
    SUM(salary) AS TOTAL
FROM
    tbl_Works
GROUP BY
    company_name
HAVING
    SUM(salary) =(
        SELECT
            MIN(total_salary)
        FROM
            (
                SELECT
                    SUM(salary) AS total_salary
                FROM
                    tbl_Works
                GROUP BY
                    company_name
            ) AS salaries
    );

--2lFind those companies whose employees earn a higher salary, on average, than the
--average salary at First Bank Corporation.
SELECT
    company_name
FROM
    tbl_Works
WHERE
    salary >(
        select
            AVG(salary) as s
        FROM
            tbl_Works
        WHERE
            company_name = 'First Bank Corporation'
    )
    AND company_name <> 'First Bank Corporation'
GROUP BY
    company_name;



SELECT
    c.company_name
FROM
    tbl_Company 
    JOIN tbl_Works w ON c.company_name = w.company_name
GROUP BY
    c.company_name
HAVING
    AVG(w.salary) > (
        SELECT
            AVG(salary)
        FROM
            tbl_Works
        WHERE
            company_name = 'First Bank Corporation'
    );



--3a) Modify the database so that Jones now lives in Newtown
UPDATE
    tbl_employee
SET
    city = 'Newtown'
WHERE
    employee_name = 'Jones';



--3bGive all employees of First Bank Corporation a 10 percent raise.
UPDATE
    tbl_Works
SET
    salary = salary * 1.1
WHERE
    company_name = 'First Bank Corporation';



--3c Give all managers of First Bank Corporation a 10 percent raise.
UPDATE
    tbl_Works
SET
    salary = salary * 1.1
WHERE
    employee_name in (
        SELECT
            manager_name
        FROM
            tbl_Manages
        WHERE
            manager_name in (
                select
                    employee_name
                FROM
                    tbl_works w
                WHERE
                    w.employee_name = manager_name
                    AND company_name = 'First Bank Corporation'
            )
    );



-- (UPDATE
--     tbl_Works
-- SET
--     salary = salary * 1.1
-- WHERE
--     employee_name IN (
--         SELECT
--             manager_name
--         FROM
--             tbl_Manages
--         WHERE
--             employee_name IN (
--                 SELECT
--                     employee_name
--                 FROM
--                     tbl_Works
--                 WHERE
--                     company_name = 'First Bank Corporation'
--             )
--     );)--this method doesnot work here because manager is from one company and employee from other company so this fails here