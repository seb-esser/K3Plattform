import streamlit as st
import folium
from streamlit_folium import st_folium


st.header("Kommende Angebote")


m = folium.Map(location=[47.83970, 11.14411], zoom_start=16)
folium.Marker(
    [47.83970, 11.14411], popup="KJR Weilheim Schongau", tooltip="KJRWMSOG"
).add_to(m)

# call to render Folium map in Streamlit
st_data = st_folium(m, width=725)
