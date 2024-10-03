FROM neo4j:latest


ENV NEO4JLABS_PLUGINS '[ "apoc" ]'
ENV NEO4J_dbms_security_procedures_unrestricted apoc.*

COPY ./apoc-5.24.0-core.jar /var/lib/neo4j/plugins


EXPOSE 7474 7687
