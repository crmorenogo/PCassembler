CREATE DATABASE PcAssembler;
USE PcAssembler;

-- Tabla de Usuario
CREATE TABLE Usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario'
);

-- Tabla de Componente
CREATE TABLE Componente (
    id_componente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria ENUM('CPU', 'GPU', 'RAM', 'Motherboard', 'Almacenamiento', 'Fuente', 'Gabinete') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    especificaciones TEXT
);

-- Tabla de Ensamble
CREATE TABLE Ensamble (
    id_ensamble INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    costo_total DECIMAL(10,2) DEFAULT 0 NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Ensamble_Componente (Relación muchos a muchos)
CREATE TABLE Ensamble_Componentes (
    FOREIGN KEY (id_ensamble) REFERENCES Ensambles(id_ensamble) ON DELETE CASCADE,
    FOREIGN KEY (id_componente) REFERENCES Componentes(id_componente) ON DELETE CASCADE
);

-- Tabla de Notificacion
CREATE TABLE Notificacion (
    id_notificacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Carrito de Compras
CREATE TABLE Carrito (
    id_carrito INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_componente INT NOT NULL,
    cantidad INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_componente) REFERENCES Componentes(id_componente) ON DELETE CASCADE
);

-- Tabla de Historial de Compras
CREATE TABLE Historial_Compras (
    id_compra INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);
