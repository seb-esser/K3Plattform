import streamlit as st

st.set_page_config(
    page_title="K3Plattform Prototyp",
    page_icon=":page_facing_up::️",
    layout="wide",
)

with st.sidebar:

    st.image("logos/kjr.png")
    st.link_button("KJR WM SOG", "https://kjr-wm-sog.de")

    st.image("logos/logo-koja.jpg")
    st.link_button("KoJa WM SOG", "https://www.weilheim-schongau.de/landkreis/jugend-und-familie/koja/")

    st.markdown("Copyright :copyright: 2024")


st.header("K3 Plattform")
st.subheader("Ein Verbundprojekt von KJR und KoJa im Landkreis Weilheim Schongau")


st.markdown("""
    Diese Plattform ist ein Prototyp, anhand dessen zukünftige Projektentwicklungen 
    für die Jugendarbeit im Landkreis Weilheim Schongau entwickelt und gestestet werden sollen.
    
    Der Fokus liegt zu Beginn auf der Bereistellung einer Koordinationsplattform, um die Verteilung von Informationen
    von und für Akteur:innen der Jugendarbeit im Landkreis zu verbessern. 
    
    Verantwortlich: 
    
    Sebastian Esser - Kreisjugendring Weilheim-Schongau
    
    Herbert Haseitl - Kreisjugendring Weilheim-Schongau   
    
    
    """)



st.info(
    """
    Diese Seite befindet sich im Aufbau und verwendet quelloffene Bibliotheken. 
    Der zugehörige Quelltext ist hier veröffentlicht: https://github.com/seb-esser/K3Plattform
"""
)
