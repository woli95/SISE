import glob
import matplotlib.pyplot as plt
import numpy as np

strategies = ['rdul',
              'rdlu',
              'drul',
              'drlu',
              'ludr',
              'lurd',
              'uldr',
              'ulrd']
ilosc_ = {}
dlugosc_rozwiazania = {}
stany_odwiedzone = {}
stany_przetworzone = {}
maksymalna_glebokosc = {}
czas_obliczen = {}

for strategy in strategies:
    dlugosc_rozwiazania[strategy] = [0 for x in range(0, 7)]
    ilosc_[strategy] = [0 for x in range(0, 7)]
    stany_odwiedzone[strategy] = [0 for x in range(0, 7)]
    stany_przetworzone[strategy] = [0 for x in range(0, 7)]
    maksymalna_glebokosc[strategy] = [0 for x in range(0, 7)]
    czas_obliczen[strategy] = [0 for x in range(0, 7)]

for strategy in strategies:
    for filename in glob.glob('./413ukladow/*bfs_' + strategy + '_stats.txt'):
        expected_result_way_length = int(filename.split('4x4_')[1].split('_')[0])
        file = open(filename, 'r')
        lines = file.readlines()
        file.close()

        ilosc_[strategy][expected_result_way_length - 1] += 1
        dlugosc_rozwiazania[strategy][expected_result_way_length - 1] += int(lines[0].replace('\n', ''))
        stany_odwiedzone[strategy][expected_result_way_length - 1] += int(lines[1].replace('\n', ''))
        stany_przetworzone[strategy][expected_result_way_length - 1] += int(lines[2].replace('\n', ''))
        maksymalna_glebokosc[strategy][expected_result_way_length - 1] = max(maksymalna_glebokosc[strategy][expected_result_way_length - 1], int(lines[3].replace('\n', '')))
        czas_obliczen[strategy][expected_result_way_length - 1] += float(lines[4].replace('\n', ''))

for strategy in strategies:
    for i in range(0, 7):
        dlugosc_rozwiazania[strategy][i] = dlugosc_rozwiazania[strategy][i] / ilosc_[strategy][i]
        stany_odwiedzone[strategy][i] = stany_odwiedzone[strategy][i] / ilosc_[strategy][i]
        stany_przetworzone[strategy][i] = stany_przetworzone[strategy][i] / ilosc_[strategy][i]
        # maksymalna_glebokosc[strategy][i] = maksymalna_glebokosc[strategy][i] / ilosc_[strategy][i]
        czas_obliczen[strategy][i] = czas_obliczen[strategy][i] / ilosc_[strategy][i]


labels = ['1', '2', '3', '4', '5', '6', '7']
x = np.arange(len(labels))
width = 0.1


def plot_this(data, xTitle, yTitle):
    fig, ax = plt.subplots()
    idx = 0
    qwe = 0
    while idx < len(strategies):
        qwe += 1
        ax.bar(x=x - width*qwe + (width/2), height=data[strategies[idx]], width=width, label=strategies[idx])
        ax.bar(x=x + width*qwe - (width/2), height=data[strategies[idx+1]], width=width, label=strategies[idx+1])
        idx += 2
    plt.ylabel(yTitle)
    plt.xlabel(xTitle)
    plt.xticks(x, labels)
    plt.legend()
    fig.tight_layout()
    plt.show()

plot_this(dlugosc_rozwiazania,"Głębokość", "Średnia długość rozwiązania")
plot_this(stany_odwiedzone, "Głębokość", "Średnia ilość stanów odwiedzonych")
plot_this(stany_przetworzone, "Głębokość", "Średnia ilość stanów przetworzonych")
plot_this(maksymalna_glebokosc, "Głębokość", "Osiągnięta maksymalna głębokość")
plot_this(czas_obliczen, "Głębokość", "Średni czas obliczeń [ms]")