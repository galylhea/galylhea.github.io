def conversor(tipo_pesos,valor_dolar):
    pesos = input("¿Cuántos pesos " + tipo_pesos + " tienes?: ")
    pesos = float(pesos)
    dolares = pesos / valor_dolar
    dolares = round(dolares, 2)
    dolares = str(dolares)
    print("Tienes $" + dolares + " dólares")

menu = """
Bienvenido al conversor de monedas 💰

1 - Pesos colombianos
2 - Pesos argentinos
3 - Pesos mexicanos

Elige una opción: """

opcion = int(input(menu))

if opcion == 1:
    conversor('colombianos', 3875)
elif opcion == 2:
    conversor('colombianos', 65)
elif opcion == 3:
    conversor('colombianos', 24)
else:
    print('Ingresa una opción correcta por favor')


# dolares = input("¿Cuántos dólares tienes?: ")
# dolares = float(dolares)
# valor_dolar = 3750.01
# pesos = dolares * valor_dolar
# pesos = int(pesos)
# pesos = str(pesos)
# print("Tienes $" + pesos + " pesos colombianos")