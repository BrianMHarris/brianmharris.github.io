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
        # break;

state_year_totals = {}

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
    with open('data/' + state.lower() + ".csv", 'w') as csvfile:
        writer = csv.writer(csvfile, delimiter=",")
        writer.writerow(("date", "city"))
        state_title = state.title()
        for row in rows[1:]:
            incident = row.select("td")
            last_slash = incident[6].text.rindex('/')
            # format the year correctly and write it out
            last_two = incident[6].text[last_slash+1:]
            first_two = "20" if int(last_two) < 18 else "19"
            full_year = first_two + last_two
            writer.writerow((full_year, incident[1].text))

            # update the state totals per year       
            if full_year not in state_year_totals:
                state_year_totals[full_year] = {}

            if state_title in state_year_totals[full_year]:
                state_year_totals[full_year][state_title] += 1
            else:
                state_year_totals[full_year][state_title] = 1

# save out the individual state totals, by year
for year in state_year_totals:
    with open('data/' + year + ".csv", 'w') as csvfile:
        writer = csv.writer(csvfile, delimiter=",")
        writer.writerow(("state", "total"))
        
        for state in state_year_totals[year].keys():
            # from IPython import embed; embed()
            writer.writerow((state, state_year_totals[year][state]))
            
            

