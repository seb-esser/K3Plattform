import numpy as np
import pandas as pd
import streamlit as st
import folium
from streamlit_folium import st_folium


st.set_page_config(
    page_title="streamlit-folium documentation",
    page_icon=":world_map:️",
    layout="wide",
)

st.header("K3 Plattform")
st.subheader("Ein Verbundprojekt von KJR und KoJa im Landkreis Weilheim Schongau")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    Diese Plattform ist ein Prototyp, anhand dessen zukünftige Projektentwicklungen 
    für die Jugendarbeit im Landkreis Weilheim Schongau entwickelt und gestestet werden sollen.
    
    Der Fokus liegt zu Beginn auf der Bereistellung einer Koordinationsplattform, um die Verteilung von Informationen
    von und für Akteur:innen der Jugendarbeit im Landkreis zu verbessern. 
    
    Verantwortlich: 
    
    Sebastian Esser - Kreisjugendring Weilheim-Schongau
    
    Herbert Haseitl - Kreisjugendring Weilheim-Schongau   
    
    
    """)

with col2:
    left_co, cent_co, last_co = st.columns(3)
    with cent_co:
        st.image("logos/kjr.png")

with col3:
    left_co, cent_co, last_co = st.columns(3)
    with cent_co:
        st.image("logos/logo-koja.jpg")


st.header("Kommende Angebote")

# df = pd.DataFrame(
#     np.array([[47.83970, 11.14411], [47.85970, 11.14411]]),
#     columns=['lat', 'lon'])
#
# st.map(df, size=3)

# center on Liberty Bell, add marker
m = folium.Map(location=[47.83970, 11.14411], zoom_start=16)
folium.Marker(
    [47.83970, 11.14411], popup="KJR Weilheim Schongau", tooltip="KJRWMSOG"
).add_to(m)

# call to render Folium map in Streamlit
st_data = st_folium(m, width=725)
