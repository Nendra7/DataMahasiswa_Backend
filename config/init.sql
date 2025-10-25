CREATE DATABASE IF NOT exists Data_Siswa;

USE Data_Siswa;

-- siswa
create table if not exists siswa (
kode_siswa int auto_increment primary key,
nama_siswa varchar(255) not null,
alamat_siswa varchar(255) not null,
tgl_siswa date,
jurusan_siswa varchar(200) not null,
createdAt datetime default current_timestamp,
updatedAt datetime default current_timestamp on update current_timestamp
);

