from pydantic import BaseModel


class SkillOut(BaseModel):
    id: int
    title: str
    order_index: int
    icon: str
    total_levels: int
    status: str          # locked | available | completed
    crowns: int

    class Config:
        from_attributes = True


class UnitOut(BaseModel):
    id: int
    title: str
    order_index: int
    skills: list[SkillOut]

    class Config:
        from_attributes = True


class CourseOut(BaseModel):
    id: int
    name: str
    language_code: str
    units: list[UnitOut]

    class Config:
        from_attributes = True