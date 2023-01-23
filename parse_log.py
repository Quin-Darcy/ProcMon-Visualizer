def main():
    logfile = open("parsed_log.txt", "a")
    with open("notepad_log.csv") as file:
        for line in file:
            t = line.split(',')
            s = str(t[0])+";"+str(t[3])+";"+str(t[4])
            logfile.write(s)

    logfile.close()

if __name__ == "__main__":
    main()
