# Sample issue generator
import random
import time
import math
import json
import re

global TOPICS
with open('topics.txt', 'r') as f:
    content = f.read()
    def split_string(x):
        spl = re.findall('[A-Z][^A-Z]*', x)
        return (' '.join(spl[::-1])).replace('  ', ' ')

    TOPICS = list(filter(lambda x: x != "", map(split_string, content.split(','))))

print(TOPICS)

PREFIXES = [
    "How do you feel about {0}?",
    "Is/Are {0} important in this region?",
    "Do you want {0}?",
    "Do you agree with {0}?",
    "Do you think {0} is a high priority for this city?",
    "For residents, what is your opinion on {0}?",
    "Should we take a stance on {0} here? Describe the pros and cons."
]

def generate_lat_lng():
    radius = 10000                         #Choose your own radius in meters
    radiusInDegrees=radius/111300
    r = radiusInDegrees
    # NY
    # x0 = 40.84
    # y0 = -73.87

    # BOS
    x0 = 41.9
    y0 = -87.624

    u = float(random.uniform(0.0,1.0))
    v = float(random.uniform(0.0,1.0))

    w = r * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)

    xLat  = x + x0
    yLong = y + y0

    return xLat, yLong

class Issue:

    def __init__(self, topic, user_id="EQo9MtWq9wWd3LmPJaJUX8F25rG2"):
        # topic = repr(topic) # escape the topic string
        self.userId = user_id
        self.description = random.choice(PREFIXES).format(topic)
        self.title = topic
        self.lat, self.lng = generate_lat_lng()
        self.place = "%s place" % topic
        self.active = True
        self.time = int(time.time())

def create_issue(topic):
    return Issue(topic)

def create_issue_query(issue):
    return ("INSERT INTO issues(user_id, description, title, lat, lng, place, active, time) values('%s', '%s', '%s', %s, %s, '%s', %s, %s);"
            % (issue.userId, issue.description.replace("'", "''"), issue.title.replace("'", "''"), issue.lat, issue.lng, issue.place.replace("'", "''"), issue.active, issue.time))

def main():

    with open('./issues.sql', 'w') as f:
        queries = list(map(lambda t: create_issue_query(create_issue(t)), TOPICS))
        f.write("\n".join(queries))

    print('done')

if __name__ == "__main__":
    main()



