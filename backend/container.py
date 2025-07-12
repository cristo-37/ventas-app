from tkinter import *
import tkinter as tk
from ventas import Ventas
from inventario import Inventario
from PIL import Image, ImageTk # type: ignore

class Container(tk.Frame):
    def __init__(self, padre, controlador):
        super().__init__(padre)
        self.controlador = controlador
        self.pack()
        self.place(x=0, y=0, width=800, height=400)
        self.config(bg="#C6D9E3")
        self.widgets()
        
    def show_frames(self, container):
        top_level = tk.Toplevel(self)
        frame = container(top_level)
        frame.config(bg="#C6D9E3")
        frame.pack(fill="both", expand= True)
        top_level.geometry("1100x650+120+20")
        top_level.resizable(False, False)
        
        top_level.transient(self.master)
        top_level.grab_set()
        top_level.focus_set()
        top_level.lift()
        
    def ventas(self):
        self.show_frames(Ventas)
        
       
    def inventario(self):
        self.show_frames(Inventario)            
        
    def widgets(self):
        
        frame1 = tk.Frame(self, bg="#C6D9E3")
        frame1.pack()
        frame1.place(x=0, y=0, width=800, height=400)
        
        imagen_pil = Image.open("icono/btnventas.png")
        imagen_resize = imagen_pil.resize((50,50))
        imagen_tk = ImageTk.PhotoImage(imagen_resize)
        
        btnventas = Button(frame1, bg="#f4b400", fg="white", font="sans 18 bold", text="Ir a ventas", command=self.ventas)  
        btnventas.config(image=imagen_tk, compound=LEFT, padx=50)
        btnventas.image = imagen_tk
        btnventas.place(x=500, y=30, width=240, height=60)  
        
        imagen_pil = Image.open("icono/btninventario.png")
        imagen_resize = imagen_pil.resize((50,50))
        imagen_tk = ImageTk.PhotoImage(imagen_resize)
        
        btninventario = Button(frame1, bg="#c62e26", fg="white", font="sans 18 bold", text="Ir a inventario", command=self.inventario)
        btninventario.config(image=imagen_tk, compound=LEFT, padx=10) 
        btninventario.image = imagen_tk
        btninventario.place(x=500, y=130, width=240, height=60) 
          
        
        self.logo_image = Image.open("imagenes/registradora.png")
        self.logo_image = self.logo_image.resize((280,280))
        self.logo_image = ImageTk.PhotoImage(self.logo_image)
        self.logo_label = tk.Label(frame1, image =self.logo_image, bg="#C6D9E3")
        self.logo_label.place(x=100, y=30)
        