INSERT INTO departments(name)
    VALUES
    ('Based Department'),
    ('Finance Department'),
    ('Computer Department');

INSERT INTO roles(title,salary,department_id)
    VALUES
    ('CEO',999999999,1),
    ('Bean Counter',100.5,2),
    ('Executive Bean Counter',101,2),
    ('nerd',69,3),
    ('chief nerd',66.99,3),
    ('Toadie',5,3);


INSERT INTO employees(first_name,last_name,role_id, manager_id)
    VALUES
    ('Will', 'Bolls', 1,NULL),
    ('Katherine', 'Yoo', 4,NULL),
    ('Jeremy', 'Lavignino', 5,1),
    ('Josh', 'Terguson', 6,3),
    ('Caden', 'Monson', 2,1),
    ('Joan', 'Bolls',3,1);