INSERT INTO departments(name)
    VALUES
    ('Based Department'),
    ('Finance Department'),
    ('Computer Department');

INSERT INTO roles(title,salary,department_id)
    VALUES
    ('CEO',99999,1),
    ('Bean Counter',100.5,2),
    ('Executive Bean Counter',101,2),
    ('nerd',70,3),
    ('chief nerd',66.99,3),
    ('Toadie',5,3);


INSERT INTO employees(first_name,last_name,role_id, manager_id)
    VALUES
    ('Will', 'Bolls', 1,NULL),
    ('Kath', 'Y', 4,NULL),
    ('J', 'Money', 5,1),
    ('Josh', 'Terg', 6,3),
    ('Cade', 'Mon', 2,1),
    ('Joan', 'Bolls',3,1);