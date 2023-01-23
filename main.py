def main():
	data = []
	with open("notepad_log.csv") as file:
		for line in file:
			t = line.split(',')
			data.append([t[0], t[3], t[4]])

	data = data[1:]
	print(data)


if __name__ == "__main__":
	main()