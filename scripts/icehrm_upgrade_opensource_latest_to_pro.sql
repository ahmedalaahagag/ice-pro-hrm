REPLACE INTO `Settings` (`name`, `value`, `description`, `meta`) VALUES
  ('LDAP: Enabled', '0',  '','["value", {"label":"Value","type":"select","source":[["0","No"],["1","Yes"]]}]'),
  ('LDAP: Server', '',  'LDAP Server IP or DNS',''),
  ('LDAP: Port', '389',  'LDAP Server Port',''),
  ('LDAP: Root DN', '',  'e.g: dc=mycompany,dc=net',''),
  ('LDAP: Manager DN', '',  'e.g: cn=admin,dc=mycompany,dc=net',''),
  ('LDAP: Manager Password', '',  'Password of the manager user',''),
  ('LDAP: Version 3', '1',  'Are you using LDAP v3','["value", {"label":"Value","type":"select","source":[["1","Yes"],["0","No"]]}]'),
  ('LDAP: User Filter', '',  'e.g: uid={}, we will replace {} with actual username provided by the user at the time of login','');

