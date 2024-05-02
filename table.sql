use recuitMIAGE;
create table user(
    id_user int primary key AUTO_INCREMENT,
    name varchar(250),
    firstname varchar(250),
    pseudo varchar(250),
    password varchar(250),
    status varchar(50),
    role varchar(50)
    );

insert into user(name,firstname,pseudo,password,status,role) values('Admin', 'tom', 'admin', 'password', 'true', 'admin');
CREATE TABLE project (
    id_project INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    creator_id INT,
    nbParticipant INT,
    date DATE,
    FOREIGN KEY (creator_id) REFERENCES user(id_user)
);
CREATE TABLE participate (
    id_participate INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_project INT,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_project) REFERENCES project(id_project)
);

