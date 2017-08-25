import requests
import bs4
import csv
import states

# the base link for all of our web scraping
base_link = "http://www.nuforc.org/webreports/"

# grab the list of valid states from the module
#  read every state, store their links (yes overwrite abbr.)
states_dict = states.states
states_url = base_link + "ndxloc.html"
states_data = requests.get(states_url)
states_soup = bs4.BeautifulSoup(states_data.text, "html.parser")
states_links = states_soup.select("font > a")

for link in states_links:
    link_titled = link.text.title()
    if link_titled in states_dict:
        states_dict[link_titled] = link['href']

# for each state, grab all data!
# this is an incredibly slow algorithm. unfortunately it's necessary.
for state, link in states_dict.items():
    # get the chunk of data and turn into a soup object
    url = base_link + link
    data = requests.get(url)
    soup = bs4.BeautifulSoup(data.text, "html.parser")
    
    # select all of the table rows in the table
    rows = soup.select("tr")

    # write out the data to the correct state file
    with open('data/' + state.lower() + ".csv", 'w') as tsvfile:
        writer = csv.writer(tsvfile, delimiter=",")
        writer.writerow(("date", "city"))
        
        for row in rows[1:]:
            incident = row.select("td")
            writer.writerow((incident[1].text, incident[6].text))
